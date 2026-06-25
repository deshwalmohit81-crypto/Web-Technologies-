import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db.js';
import { generateChatResponse } from './src/server/gemini.js';
import { sendContactFormEmails, sendNewsletterEmails, sendJobApplicationEmails, simulatedEmails } from './src/server/emailService.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'deshwal_secret_corporate_token_2026_xyz';
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // JWT auth middleware
  function authenticateToken(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token is missing' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ error: 'Token is invalid or expired' });
      }
      req.user = user;
      next();
    });
  }

  // --- AUTH ENDPOINTS ---
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = db.getAdminByUsername(username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = bcrypt.compareSync(password, admin.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    const admin = db.getAdmins().find(a => a.id === req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    });
  });

  // --- CLIENT AUTH & PORTAL ENDPOINTS ---
  app.post('/api/client/auth/signup', (req, res) => {
    const { name, email, companyName, phone, password } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required' });
    }

    const existingClient = db.getClientByEmail(email);
    if (existingClient) {
      return res.status(409).json({ error: 'A client with this email address already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newClient = db.addClient({
      name,
      email,
      companyName: companyName || '',
      phone,
      passwordHash
    });

    const token = jwt.sign(
      { id: newClient.id, email: newClient.email, role: 'client' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newClient.id,
        name: newClient.name,
        email: newClient.email,
        companyName: newClient.companyName,
        phone: newClient.phone,
        role: 'client'
      }
    });
  });

  app.post('/api/client/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const client = db.getClientByEmail(email);
    if (!client) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = bcrypt.compareSync(password, client.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: client.id, email: client.email, role: 'client' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        companyName: client.companyName,
        phone: client.phone,
        role: 'client'
      }
    });
  });

  app.get('/api/client/auth/me', authenticateToken, (req: any, res) => {
    const client = db.getClients().find(c => c.id === req.user.id);
    if (!client) {
      return res.status(404).json({ error: 'Client account not found' });
    }
    res.json({
      id: client.id,
      name: client.name,
      email: client.email,
      companyName: client.companyName,
      phone: client.phone,
      role: 'client'
    });
  });

  // Client Projects Endpoints
  app.get('/api/client/projects', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Access denied: client permissions required' });
    }
    const projects = db.getClientProjects(req.user.id);
    res.json(projects);
  });

  app.post('/api/client/projects', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Access denied: client permissions required' });
    }
    const { title, service, budget, description } = req.body;
    if (!title || !service || !description) {
      return res.status(400).json({ error: 'Title, service, and description are required' });
    }

    // Add to client projects
    const newProject = db.addClientProject({
      clientId: req.user.id,
      title,
      service,
      budget: budget || 'TBD',
      description
    });

    // Also automatically create a standard lead so the admins can view it in the CRM!
    const client = db.getClients().find(c => c.id === req.user.id);
    if (client) {
      db.addLead({
        name: client.name,
        email: client.email,
        phone: client.phone,
        service: `${service} (Client Portal: ${title})`,
        plan: `Client Dashboard Request (Budget: ${budget || 'TBD'})`,
        message: description
      });
    }

    res.status(201).json(newProject);
  });

  // Client Support Tickets Endpoints
  app.get('/api/client/tickets', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Access denied: client permissions required' });
    }
    const tickets = db.getClientTickets(req.user.id);
    res.json(tickets);
  });

  app.post('/api/client/tickets', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Access denied: client permissions required' });
    }
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const newTicket = db.addClientTicket({
      clientId: req.user.id,
      subject,
      message
    });

    res.status(201).json(newTicket);
  });

  app.post('/api/client/tickets/:id/replies', authenticateToken, (req: any, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Reply message is required' });
    }

    // Role-based replies (client can reply, and admin/editor can reply)
    const sender = req.user.role === 'client' ? 'client' : 'support';
    const updatedTicket = db.addTicketReply(req.params.id, {
      sender,
      message
    });

    if (!updatedTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(updatedTicket);
  });

  // Admin-side client project management endpoints
  app.get('/api/admin/client-projects', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({ error: 'Access denied: Administrator permissions required' });
    }
    res.json(db.getAllClientProjects());
  });

  app.put('/api/admin/client-projects/:id', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({ error: 'Access denied: Administrator permissions required' });
    }
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = db.updateClientProjectStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(updated);
  });

  // Admin-side client ticket management endpoints
  app.get('/api/admin/client-tickets', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({ error: 'Access denied: Administrator permissions required' });
    }
    res.json(db.getAllClientTickets());
  });

  app.put('/api/admin/client-tickets/:id', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({ error: 'Access denied: Administrator permissions required' });
    }
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = db.updateTicketStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(updated);
  });

  // --- BLOG ENDPOINTS ---
  app.get('/api/blogs', (req, res) => {
    res.json(db.getBlogs());
  });

  app.post('/api/blogs', authenticateToken, (req, res) => {
    const { title, slug, content, excerpt, category, author, image, readTime } = req.body;
    if (!title || !slug || !content || !category || !author) {
      return res.status(400).json({ error: 'Title, slug, content, category, and author are required' });
    }
    const newBlog = db.addBlog({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      category,
      author,
      image: image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
      readTime: readTime || '4 min read'
    });
    res.status(201).json(newBlog);
  });

  app.put('/api/blogs/:id', authenticateToken, (req, res) => {
    const updated = db.updateBlog(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(updated);
  });

  app.delete('/api/blogs/:id', authenticateToken, (req, res) => {
    db.deleteBlog(req.params.id);
    res.json({ success: true });
  });

  // --- PORTFOLIO ENDPOINTS ---
  app.get('/api/portfolios', (req, res) => {
    res.json(db.getPortfolios());
  });

  app.post('/api/portfolios', authenticateToken, (req, res) => {
    const { title, category, description, image, tags, client, website, challenge, solution, results, completionDate, featured } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required' });
    }
    const newPort = db.addPortfolio({
      title,
      category,
      description,
      image: image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      tags: tags || [],
      client: client || 'Private Client',
      website,
      challenge: challenge || 'No challenge documented.',
      solution: solution || 'No solution documented.',
      results: results || 'No results documented.',
      completionDate: completionDate || new Date().toISOString().split('T')[0],
      featured: !!featured
    });
    res.status(201).json(newPort);
  });

  app.put('/api/portfolios/:id', authenticateToken, (req, res) => {
    const updated = db.updatePortfolio(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    res.json(updated);
  });

  app.delete('/api/portfolios/:id', authenticateToken, (req, res) => {
    db.deletePortfolio(req.params.id);
    res.json({ success: true });
  });

  // --- LEAD ENDPOINTS ---
  app.get('/api/leads', authenticateToken, (req, res) => {
    res.json(db.getLeads());
  });

  app.post('/api/leads', (req, res) => {
    const { name, email, phone, service, plan, message } = req.body;
    if (!name || !email || !phone || !service) {
      return res.status(400).json({ error: 'Name, email, phone, and service are required' });
    }
    const lead = db.addLead({
      name,
      email,
      phone,
      service,
      plan,
      message: message || ''
    });

    // Send async emails (confirmations to user and notifications to admin)
    sendContactFormEmails({
      name,
      email,
      phone,
      service,
      plan,
      message: message || ''
    }).catch(err => console.error('Error dispatching contact emails:', err));

    res.status(201).json(lead);
  });

  app.put('/api/leads/:id', authenticateToken, (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = db.updateLeadStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(updated);
  });

  app.delete('/api/leads/:id', authenticateToken, (req, res) => {
    db.deleteLead(req.params.id);
    res.json({ success: true });
  });

  // --- NEWSLETTER SUBS ---
  app.get('/api/newsletter', authenticateToken, (req, res) => {
    res.json(db.getNewsletterSubs());
  });

  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const result = db.addNewsletterSub(email);
    if ('alreadyExists' in result) {
      return res.status(409).json({ message: 'This email is already subscribed' });
    }

    // Send async newsletter confirmations
    sendNewsletterEmails(email).catch(err => console.error('Error dispatching newsletter emails:', err));

    res.status(201).json(result);
  });

  app.delete('/api/newsletter/:id', authenticateToken, (req, res) => {
    db.deleteNewsletterSub(req.params.id);
    res.json({ success: true });
  });

  // --- CAREER ENDPOINTS ---
  app.get('/api/careers', (req, res) => {
    res.json(db.getCareers());
  });

  app.post('/api/careers', authenticateToken, (req, res) => {
    const { title, department, location, type, experience, salary, description, requirements, responsibilities, active } = req.body;
    if (!title || !department || !location || !type || !description) {
      return res.status(400).json({ error: 'Missing required job listing details' });
    }
    const listing = db.addJobListing({
      title,
      department,
      location,
      type,
      experience: experience || 'Not specified',
      salary: salary || 'Competitive',
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      active: active !== undefined ? !!active : true
    });
    res.status(201).json(listing);
  });

  app.put('/api/careers/:id', authenticateToken, (req, res) => {
    const updated = db.updateJobListing(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Job listing not found' });
    }
    res.json(updated);
  });

  app.delete('/api/careers/:id', authenticateToken, (req, res) => {
    db.deleteJobListing(req.params.id);
    res.json({ success: true });
  });

  // --- JOB APPLICATION ENDPOINTS ---
  app.get('/api/applications', authenticateToken, (req, res) => {
    res.json(db.getApplications());
  });

  app.post('/api/applications', (req, res) => {
    const { jobId, jobTitle, name, email, phone, coverLetter, portfolioUrl } = req.body;
    if (!jobId || !jobTitle || !name || !email || !phone || !coverLetter) {
      return res.status(400).json({ error: 'Missing required application parameters' });
    }
    const appRecord = db.addApplication({
      jobId,
      jobTitle,
      name,
      email,
      phone,
      coverLetter,
      portfolioUrl
    });

    // Send async job application emails (confirmation and admin notice)
    sendJobApplicationEmails({
      name,
      email,
      phone,
      jobTitle,
      coverLetter,
      portfolioUrl
    }).catch(err => console.error('Error dispatching career application emails:', err));

    res.status(201).json(appRecord);
  });

  app.put('/api/applications/:id', authenticateToken, (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = db.updateApplicationStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(updated);
  });

  app.delete('/api/applications/:id', authenticateToken, (req, res) => {
    db.deleteApplication(req.params.id);
    res.json({ success: true });
  });

  // --- AI CHAT CONSULTANT ENDPOINT ---
  app.post('/api/ai-chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message parameter is required' });
    }
    const responseText = await generateChatResponse(history || [], message);
    res.json({ response: responseText });
  });

  // --- RAZORPAY / PAYMENT GATEWAY SIMULATION ---
  app.post('/api/payments/create-order', (req, res) => {
    const { planName, price, clientName, clientEmail, clientPhone } = req.body;
    if (!planName || !price) {
      return res.status(400).json({ error: 'Plan name and price are required' });
    }

    // Creating a mock Razorpay order reference ID
    const orderId = 'order_' + Math.random().toString(36).substring(2, 11).toUpperCase();
    
    // Simulate SMTP notification / Lead Capture for purchase
    db.addLead({
      name: clientName || 'Anonymous Buyer',
      email: clientEmail || 'no-email@payment.com',
      phone: clientPhone || '+91 0000000000',
      service: `Purchase Plan: ${planName}`,
      plan: planName,
      message: `System Alert: User initialized payment checkout for plan ${planName} (₹${price.toLocaleString('en-IN')}). OrderReference: ${orderId}`
    });

    res.json({
      success: true,
      orderId,
      planName,
      amount: price * 100, // in paise
      currency: 'INR',
      key_id: 'rzp_test_deshwalMockKey2026', // Simulated key
      companyName: 'DESHWAL WEB TECHNOLOGIES PVT LTD',
      supportEmail: 'deshwalmohit.81@gmail.com',
      supportPhone: '+91 9389667600'
    });
  });

  // --- SIMULATED EMAILS ENDPOINT FOR PREVIEW/DEV ENVIRONMENT ---
  app.get('/api/simulated-emails', (req, res) => {
    res.json(simulatedEmails);
  });

  // --- DASHBOARD ANALYTICS ENDPOINT ---
  app.get('/api/admin/stats', authenticateToken, (req, res) => {
    const leads = db.getLeads();
    const subs = db.getNewsletterSubs();
    const blogs = db.getBlogs();
    const ports = db.getPortfolios();
    const apps = db.getApplications();

    // Map leads by services for bar charts
    const servicesMap: { [key: string]: number } = {};
    leads.forEach(l => {
      const s = l.service || 'General Inquiry';
      servicesMap[s] = (servicesMap[s] || 0) + 1;
    });
    const leadsByService = Object.keys(servicesMap).map(key => ({
      service: key,
      count: servicesMap[key]
    }));

    // Leads over the last 7 days
    const datesMap: { [key: string]: number } = {};
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(day => {
      datesMap[day] = 0;
    });

    leads.forEach(l => {
      const dateStr = l.createdAt.split('T')[0];
      if (datesMap[dateStr] !== undefined) {
        datesMap[dateStr]++;
      }
    });

    const leadsOverTime = Object.keys(datesMap).map(key => ({
      date: key,
      count: datesMap[key]
    })).sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      totalLeads: leads.length,
      pendingLeads: leads.filter(l => l.status === 'pending').length,
      totalSubs: subs.length,
      totalBlogs: blogs.length,
      totalPortfolios: ports.length,
      totalApplications: apps.length,
      leadsByService,
      leadsOverTime
    });
  });

  // --- STATIC ASSETS & VITE INTEGRATION ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DESHWAL PVT LTD App Server listening on http://localhost:${PORT}`);
  });
}

startServer();
