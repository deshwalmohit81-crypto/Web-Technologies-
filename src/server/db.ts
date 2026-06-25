import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Blog, Portfolio, Lead, NewsletterSub, JobListing, JobApplication, AdminUser, ClientUser, ClientProject, ClientTicket, Service, PricingPlan } from '../types.js';

const DB_FILE = path.join(process.cwd(), 'db.json');

interface DbClientUser extends ClientUser {
  passwordHash: string;
  resetToken?: string;
  resetTokenExpires?: string;
  emailVerified?: boolean;
}

interface Schema {
  blogs: Blog[];
  portfolios: Portfolio[];
  leads: Lead[];
  newsletter: NewsletterSub[];
  careers: JobListing[];
  applications: JobApplication[];
  admins: { 
    id: string; 
    username: string; 
    email: string; 
    passwordHash: string; 
    role: 'admin' | 'editor';
    resetToken?: string;
    resetTokenExpires?: string;
    emailVerified?: boolean;
  }[];
  clients: DbClientUser[];
  clientProjects: ClientProject[];
  clientTickets: ClientTicket[];
  services: Service[];
  pricingPlans: PricingPlan[];
}

const defaultDb: Schema = {
  blogs: [
    {
      id: 'b1',
      title: 'The Future of Web Development: Key Trends for 2026',
      slug: 'future-of-web-development-2026',
      excerpt: 'Discover the latest paradigms shaping modern web development, from React 19 features to AI-augmented coding, server component optimizations, and Tailwind v4.',
      content: `### Introduction to the New Digital Era

The web development landscape is evolving at an unprecedented pace. As we head into 2026, companies are demanding faster load times, more fluid user interfaces, and deeper AI integrations. 

In this article, we outline the major technologies and philosophies driving web development this year.

---

### 1. React 19 & Next.js 15 Foundations
React 19 has officially stabilized, bringing with it powerful features like:
- **Server Actions**: Simplifying form submissions and data mutations directly from components.
- **Improved Suspense**: Staggered loading states with zero layout shifts.
- **The React Compiler**: Eliminating the need for manual \`useMemo\` and \`useCallback\` hook optimization.

At **DESHWAL WEB TECHNOLOGIES**, we have already transitioned our core boilerplate systems to React 19 to provide lightweight, blazingly fast client experiences.

---

### 2. Micro-Frontends and Server-Side Rendering (SSR)
While Single Page Applications (SPAs) are excellent for specific workflows, hybrid models leveraging SSR and static generation are critical for modern SEO and instant loading times. High performance directly impacts search engine visibility, making SSR a priority for any growth-oriented startup.

---

### 3. Tailwind CSS v4 and Modern Layouts
Tailwind v4 introduces a streamlined compiler, custom themes out of the box, and native support for CSS variables. With features like container queries and enhanced grid systems, we can craft highly fluid layouts without writing a single line of redundant CSS.

---

### Conclusion
Embracing these advancements isn't just about using the latest tools—it is about creating robust, future-proof digital assets that drive conversions and increase user engagement. Partner with Deshwal Web Technologies to elevate your next project today!`,
      category: 'Web Development',
      author: 'Mohit Deshwal',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      readTime: '5 min read',
      createdAt: '2026-06-15T10:00:00Z'
    },
    {
      id: 'b2',
      title: 'Maximizing E-Commerce Conversions with UX Design',
      slug: 'maximize-ecommerce-conversions-ux',
      excerpt: 'A comprehensive guide to leveraging user experience principles, checkout optimizations, and speed metrics to turn casual browsers into loyal customers.',
      content: `### Why E-Commerce Conversions Fail

Did you know that the average e-commerce shopping cart abandonment rate is over 70%? A major portion of this loss is due to friction in user experience, lack of payment options, or slow loading speeds.

---

### Key Pillars of Modern E-Commerce UX

#### 1. Frictionless Checkout Flow
- **One-Page Checkout**: Condense shipping, billing, and review into a single, clean layout.
- **Guest Checkout**: Never force a user to create an account before buying.
- **Express Payments**: Support digital wallets (UPI, Razorpay, GPay) to enable 2-click checkouts.

#### 2. Mobile-First Optimization
Over 60% of all online shopping occurs on mobile devices. If your web-store feels clunky or difficult to tap on mobile screens, you are losing more than half of your potential sales. Use fluid layouts, touch-optimized button targets, and high-quality optimized imagery.

#### 3. Visual Trust & Security Elements
Trust badges, clear security indicators (SSL certificates), transparent return policies, and instant support widgets (such as WhatsApp Live Chat) significantly reduce a buyer's risk perception.

---

### Elevate Your Online Sales
At **DESHWAL WEB TECHNOLOGIES**, we specialize in high-performance e-commerce development integrating custom portals, Razorpay gateway configurations, and CRM integrations to supercharge your sales velocity.`,
      category: 'E-Commerce',
      author: 'Mohit Deshwal',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      readTime: '4 min read',
      createdAt: '2026-06-20T11:30:00Z'
    },
    {
      id: 'b3',
      title: 'SEO Best Practices for Startups: A Step-by-Step Guide',
      slug: 'seo-best-practices-startups',
      excerpt: 'Learn how to configure schema markups, sitemaps, semantic HTML, and high-performance metrics to climb Google rankings and attract organic leads.',
      content: `### Startups and the SEO Challenge

For a new business, organic visibility is a superpower. Unlike paid ads, which stop driving traffic the moment your budget runs dry, a strong SEO framework continues to attract qualified leads for months and years.

---

### Step-by-Step Startup SEO Roadmap

#### Step 1: Technical SEO Audit
Before writing a single piece of content, verify that your website is fully readable by Googlebot.
- Use **semantic HTML5 elements** (\`<header>\`, \`<main>\`, \`<section>\`, \`<article>\`).
- Implement dynamic **Meta Tags** and Open Graph (OG) tags for social media.
- Deploy an XML **Sitemap** and set up a proper \`robots.txt\` file.

#### Step 2: Site Performance Metrics
Google utilizes Core Web Vitals to rank pages. Sites with slow loads or shifting elements are penalized. Focus on **Lighthouse scores of 95+**:
- Compress and lazy-load all images.
- Minimize Javascript bundles.
- Host on fast, edge-cached servers like Cloud Run or Vercel.

#### Step 3: Implement Structured Data Schema
Schema markup tells search engines exactly what your content means. Add corporate schema, product schema, or FAQ schema to stand out with rich search results.

---

### Ready to Rank?
Our dedicated SEO team at Deshwal Web Technologies implements end-to-end optimizations to help your brand conquer competitive keywords. Contact us for a free audit report!`,
      category: 'SEO',
      author: 'Mohit Deshwal',
      image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=800&q=80',
      readTime: '6 min read',
      createdAt: '2026-06-22T09:15:00Z'
    }
  ],
  portfolios: [
    {
      id: 'p1',
      title: 'Apex E-Commerce Hub',
      category: 'E-Commerce Stores',
      description: 'A premium, high-speed retail platform built with React and Express, integrated with automated inventory tracking and seamless Razorpay checkouts.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80',
      tags: ['React', 'Node.js', 'Tailwind CSS', 'Razorpay', 'MongoDB'],
      client: 'Apex Retail Group',
      website: 'https://apex-retail-demo.web.deshwal.in',
      challenge: 'The client faced slow checkout load times (over 6 seconds) and high cart abandonment rates on their legacy PHP platform.',
      solution: 'We completely rebuilt the frontend using React 19 and Vite with Tailwind. The backend was restructured into a custom Express API proxying payments securely via Razorpay.',
      results: 'Checkout speeds dropped to under 1.2 seconds, causing a 42% surge in completed checkouts within the first month.',
      completionDate: '2026-04-12',
      featured: true
    },
    {
      id: 'p2',
      title: 'Zenith Healthcare App',
      category: 'Mobile Applications',
      description: 'A native-feeling cross-platform mobile application for doctor scheduling, instant tele-consultation, and prescription management.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      tags: ['React Native', 'Node.js', 'WebRTC', 'Firebase', 'Express'],
      client: 'Zenith Health Solutions',
      challenge: 'The lack of reliable telehealth options during emergencies forced patients to endure long hospital queues.',
      solution: 'We engineered a React Native mobile application integrated with WebRTC for reliable, encrypted video calls and push notifications via Firebase Cloud Messaging.',
      results: 'Successfully onboarded over 500 active doctors, cutting booking-to-consultation cycles by 70%.',
      completionDate: '2026-05-30',
      featured: true
    },
    {
      id: 'p3',
      title: 'Fintech Pro Solutions',
      category: 'Corporate Solutions',
      description: 'A secure, enterprise-grade business management portal with granular role-based permissions, digital invoicing, and compliance tracking.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      tags: ['React', 'TypeScript', 'Node.js', 'Express', 'JWT Auth', 'MongoDB'],
      client: 'Fintech Capital Ltd',
      challenge: 'Manual compliance logging and legacy accounting methods resulted in regular bookkeeping discrepancies and audit friction.',
      solution: 'Created a central ERP and compliance portal with highly structured database logs, automated audit trails, and cryptographically signed JWT sessions.',
      results: 'Zero billing errors over two quarters, reducing external corporate auditing expenses by 35%.',
      completionDate: '2026-03-15',
      featured: false
    },
    {
      id: 'p4',
      title: 'SaaS Metrics Dashboard',
      category: 'Business Websites',
      description: 'A gorgeous, interactive real-time telemetry dashboard for monitoring cloud-native SaaS pipelines, analytics, and active user retention.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      tags: ['React', 'Framer Motion', 'Tailwind v4', 'D3.js', 'WebSockets'],
      client: 'SaaSScale Inc',
      challenge: 'The SaaS company had high telemetry churn because their legacy charts were static and failed to present complex user journeys clearly.',
      solution: 'We designed a custom interactive visualization engine using D3.js and Framer Motion, presenting real-time WebSocket feeds with premium transitions.',
      results: 'Onboarded as their core client-facing analytics suite, resulting in a 25% improvement in trial-to-paid conversion rates.',
      completionDate: '2026-02-10',
      featured: true
    }
  ],
  leads: [],
  newsletter: [],
  careers: [
    {
      id: 'j1',
      title: 'Senior Full Stack Developer',
      department: 'Technology',
      location: 'Remote (India)',
      type: 'Full-time',
      experience: '5+ Years',
      salary: '₹12,00,000 - ₹18,00,000 PA',
      description: 'We are seeking a senior technical engineer skilled in React, Node.js, Express, and cloud deployments to lead our core client projects.',
      requirements: [
        'Deep expertise in React 18/19, Next.js, and TypeScript.',
        'Robust experience building scalable backend services with Express.js and databases (MongoDB/Postgres).',
        'Familiarity with Tailwind CSS, Framer Motion, and layout engineering.',
        'Experience integrating payment architectures like Razorpay and secure JWT session controls.',
        'Strong leadership skills to guide junior and mid-level developers.'
      ],
      responsibilities: [
        'Architect, write, and deploy pristine, highly performant web applications.',
        'Review pull requests and ensure exceptional code quality across repositories.',
        'Collaborate with UI/UX design teams to translate wireframes into interactive layouts.',
        'Optimize platform metrics to sustain Lighthouse scores above 95.'
      ],
      active: true,
      createdAt: '2026-06-24T00:00:00Z'
    },
    {
      id: 'j2',
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote (India)',
      type: 'Full-time',
      experience: '3+ Years',
      salary: '₹6,00,000 - ₹10,00,000 PA',
      description: 'We are looking for a creative UI/UX designer to translate complex technical workflows into beautiful, minimalist, high-converting interfaces.',
      requirements: [
        'Solid portfolio demonstrating advanced user research, typography pairing, and visual layout crafting.',
        'Expert command of Figma, mockups, design systems, and vector components.',
        'Understanding of Tailwind CSS grids and layouts to collaborate effectively with frontend coders.',
        'Ability to design dark-themed SaaS dashboards and high-conversion landing pages.'
      ],
      responsibilities: [
        'Conduct stakeholder interviews and build wireframes and high-fidelity interactive Figma prototypes.',
        'Define modern typography systems, color scales, and spacing frameworks.',
        'Iterate based on client feedback to deliver pixel-perfect user journeys.'
      ],
      active: true,
      createdAt: '2026-06-24T00:00:00Z'
    },
    {
      id: 'j3',
      title: 'Digital Marketing & SEO Specialist',
      department: 'Marketing',
      location: 'Remote (India)',
      type: 'Full-time',
      experience: '2+ Years',
      salary: '₹4,50,000 - ₹7,00,000 PA',
      description: 'Join our marketing squad to drive search rankings, optimize off-page SEO, manage campaigns, and capture high-converting business leads.',
      requirements: [
        'Proven history of improving organic search traffic for corporate domains.',
        'Excellent understanding of technical SEO, meta-tags, semantic markup, and sitemaps.',
        'Proficiency with Google Search Console, Google Analytics, and SEO keyword tracking suites.',
        'Experience managing lead capture funnels and newsletter campaign execution.'
      ],
      responsibilities: [
        'Perform on-page and technical SEO audits for client platforms.',
        'Execute off-page backlink strategies and keyword mapping pipelines.',
        'Deliver comprehensive weekly traffic and optimization performance metrics reports.'
      ],
      active: true,
      createdAt: '2026-06-24T00:00:00Z'
    }
  ],
  applications: [],
  admins: [], // Initialized dynamically in the constructor/loader
  clients: [],
  clientProjects: [],
  clientTickets: [],
  services: [
    {
      id: 'web-dev',
      icon: 'Code',
      title: 'Website Development',
      desc: 'We engineer blazingly fast, modern websites using React 19, TypeScript, and Tailwind CSS. Fully responsive and optimized for the edge.',
      deliverables: ['Custom SPA / Landing Pages', 'Server Components Optimization', 'Fluid Framer Motion Loops', 'Semantic HTML5 structure'],
    },
    {
      id: 'ecommerce',
      icon: 'ShoppingBag',
      title: 'E-Commerce Development',
      desc: 'Bespoke online retail platforms integrated with dynamic stock systems, advanced admin sales panels, and secure Razorpay gateway checkouts.',
      deliverables: ['Razorpay payment checkouts', 'Granular Inventory Panels', 'One-Click Customer Checkout', 'Sales telemetry tracking'],
    },
    {
      id: 'mobile-apps',
      icon: 'Smartphone',
      title: 'Mobile App Development',
      desc: 'Native-feeling cross-platform iOS and Android apps crafted securely using React Native, fast state synch, and offline support.',
      deliverables: ['Cross-platform mobile apps', 'Local SQLite Cache syncing', 'Firebase Push Notification hooks', 'Biometric login configs'],
    },
    {
      id: 'software-dev',
      icon: 'Laptop',
      title: 'Software Development',
      desc: 'Formulating robust corporate SaaS dashboards, custom cloud infrastructure, and backend Node.js APIs supporting secure compliance auditing.',
      deliverables: ['JWT Authentication systems', 'Throttling security rules', 'Relational SQLite/MongoDB DBs', 'Custom telemetry widgets'],
    },
    {
      id: 'ui-ux',
      icon: 'Figma',
      title: 'UI/UX Design',
      desc: 'Transforming complex administrative workflows into beautiful, minimalist interactive layouts. Advanced Figma systems.',
      deliverables: ['High-Fidelity Figma prototypes', 'Grid and Typography scales', 'Comprehensive User flow wireframes', 'Interactive hover mockups'],
    },
    {
      id: 'seo',
      icon: 'Search',
      title: 'SEO Services',
      desc: 'Aggressive technical optimization, schema markups, robotic indexing paths, and Sitemap creations to climb competitive search engine ranks.',
      deliverables: ['JSON-LD structured schema', 'Dynamic robots & sitemap files', 'Google Search Console syncing', 'Keywords competition reports'],
    },
    {
      id: 'digital-marketing',
      icon: 'Megaphone',
      title: 'Digital Marketing',
      desc: 'Setting up automated customer funnels, social media advertisement integrations, and targeting campaigns to scale lead acquisition pipelines.',
      deliverables: ['Targeted social campaign layouts', 'Email automation synchronization', 'Google Analytics dashboard tracking', 'Lead Capture optimization'],
    },
    {
      id: 'graphic-design',
      icon: 'Palette',
      title: 'Graphic Designing',
      desc: 'Premium vector branding graphics, corporate presentation layouts, custom logotypes, and digital media assets.',
      deliverables: ['Custom branding scale systems', 'Social media graphic bundles', 'High-impact pitch presentations', 'Scalable SVG logo vectors'],
    },
    {
      id: 'maintenance',
      icon: 'Hammer',
      title: 'Website Maintenance',
      desc: 'Routine security patch deployments, database backups, package version updates, and visual component tuning.',
      deliverables: ['Secure weekly server backups', 'Security audit evaluations', 'Page response-speed tuning', 'Asset optimization syncs'],
    },
    {
      id: 'custom-solutions',
      icon: 'Settings',
      title: 'Custom Business Solutions',
      desc: 'Highly customized business solutions, including centralized ERPs, payroll tracking tools, CRM suites, and pipeline automations.',
      deliverables: ['Centralized SaaS ERP architectures', 'CRM automation modules', 'Granular employee permission matrices', 'Structured data logging'],
    },
  ],
  pricingPlans: [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: 4999,
      period: 'One-time',
      tagline: 'Best for small businesses',
      icon: 'Zap',
      features: [
        'Basic Informational Website',
        '5 Responsive Pages',
        'Structured Contact Inquiry Form',
        'Standard Tailwind UI layout',
        'Free Domain Mapping (web.deshwal.in sub)',
        '1 Month Post-Launch Support',
      ],
      popular: false,
    },
    {
      id: 'business',
      name: 'Business Plan',
      price: 9999,
      period: 'One-time',
      tagline: 'Perfect for scaling ventures',
      icon: 'Flame',
      features: [
        'Dynamic Custom Website',
        'Self-Serve Administrative Panel',
        'On-page SEO Technical Alignment',
        'Google Search Console setup',
        'Up to 15 Responsive Pages',
        'Database persistent leads tracker',
        '3 Months Post-Launch Support',
      ],
      popular: true,
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: 19999,
      period: 'One-time',
      tagline: 'Complete e-commerce capability',
      icon: 'Award',
      features: [
        'High-speed E-Commerce Platform',
        'Razorpay Payments gateway integration',
        'Granular Inventory management',
        'Interactive administrative sales charts',
        'Custom corporate database models',
        'Technical SEO Schema configurations',
        '6 Months Dedicated Support',
      ],
      popular: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 'Custom',
      period: 'Bespoke contract',
      tagline: 'Bespoke corporate architecture',
      icon: 'ShieldCheck',
      features: [
        'Custom ERP & CRM architectures',
        'Bespoke Cloud Infrastructure (Cloud Run)',
        'Highly compliant secure JWT access controls',
        'Gemini AI chat solutions integrated',
        'Dedicated Developer & Solution Architect',
        '24/7 Reaction SLA guarantees',
        'Infinite Scale & Continuous Backups',
      ],
      popular: false,
    },
  ]
};

class LocalDatabase {
  private db: Schema = { ...defaultDb };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        this.db = JSON.parse(data);
        // Migration checks to support client arrays safely
        if (!this.db.leads) this.db.leads = [];
        if (!this.db.newsletter) this.db.newsletter = [];
        if (!this.db.careers) this.db.careers = [];
        if (!this.db.applications) this.db.applications = [];
        if (!this.db.blogs) this.db.blogs = [...defaultDb.blogs];
        if (!this.db.portfolios) this.db.portfolios = [...defaultDb.portfolios];
        if (!this.db.clients) this.db.clients = [];
        if (!this.db.clientProjects) this.db.clientProjects = [];
        if (!this.db.clientTickets) this.db.clientTickets = [];
        if (!this.db.services) {
          this.db.services = [...defaultDb.services];
        }
        if (!this.db.pricingPlans) {
          this.db.pricingPlans = [...defaultDb.pricingPlans];
        }
        if (!this.db.admins || this.db.admins.length === 0) {
          const salt = bcrypt.genSaltSync(10);
          const passwordHash = bcrypt.hashSync('Admin@Deshwal2026', salt);
          this.db.admins = [
            {
              id: 'a1',
              username: 'admin',
              email: 'deshwalmohit.81@gmail.com',
              passwordHash,
              role: 'admin'
            }
          ];
        }
        this.save();
      } else {
        // Initialize admin password dynamically
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync('Admin@Deshwal2026', salt);
        this.db.admins = [
          {
            id: 'a1',
            username: 'admin',
            email: 'deshwalmohit.81@gmail.com',
            passwordHash,
            role: 'admin'
          }
        ];
        this.save();
      }
    } catch (e) {
      console.error('Failed to load database:', e);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save database:', e);
    }
  }

  // Admin APIs
  getAdmins() {
    return this.db.admins;
  }

  getAdminByUsername(username: string) {
    return this.db.admins.find(a => a.username.toLowerCase() === username.toLowerCase());
  }

  // Blogs APIs
  getBlogs() {
    return this.db.blogs;
  }

  getBlogBySlug(slug: string) {
    return this.db.blogs.find(b => b.slug === slug);
  }

  addBlog(blog: Omit<Blog, 'id' | 'createdAt'>) {
    const newBlog: Blog = {
      ...blog,
      id: 'b_' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString()
    };
    this.db.blogs.push(newBlog);
    this.save();
    return newBlog;
  }

  updateBlog(id: string, updated: Partial<Blog>) {
    const idx = this.db.blogs.findIndex(b => b.id === id);
    if (idx !== -1) {
      this.db.blogs[idx] = { ...this.db.blogs[idx], ...updated };
      this.save();
      return this.db.blogs[idx];
    }
    return null;
  }

  deleteBlog(id: string) {
    this.db.blogs = this.db.blogs.filter(b => b.id !== id);
    this.save();
    return true;
  }

  // Portfolios APIs
  getPortfolios() {
    return this.db.portfolios;
  }

  addPortfolio(portfolio: Omit<Portfolio, 'id'>) {
    const newPortfolio: Portfolio = {
      ...portfolio,
      id: 'p_' + Math.random().toString(36).substring(2, 11)
    };
    this.db.portfolios.push(newPortfolio);
    this.save();
    return newPortfolio;
  }

  updatePortfolio(id: string, updated: Partial<Portfolio>) {
    const idx = this.db.portfolios.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.db.portfolios[idx] = { ...this.db.portfolios[idx], ...updated };
      this.save();
      return this.db.portfolios[idx];
    }
    return null;
  }

  deletePortfolio(id: string) {
    this.db.portfolios = this.db.portfolios.filter(p => p.id !== id);
    this.save();
    return true;
  }

  // Leads APIs
  getLeads() {
    return this.db.leads;
  }

  addLead(lead: Omit<Lead, 'id' | 'status' | 'createdAt'>) {
    const newLead: Lead = {
      ...lead,
      id: 'l_' + Math.random().toString(36).substring(2, 11),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.db.leads.push(newLead);
    this.save();
    return newLead;
  }

  updateLeadStatus(id: string, status: Lead['status']) {
    const lead = this.db.leads.find(l => l.id === id);
    if (lead) {
      lead.status = status;
      this.save();
      return lead;
    }
    return null;
  }

  deleteLead(id: string) {
    this.db.leads = this.db.leads.filter(l => l.id !== id);
    this.save();
    return true;
  }

  // Newsletter APIs
  getNewsletterSubs() {
    return this.db.newsletter;
  }

  addNewsletterSub(email: string) {
    if (this.db.newsletter.some(n => n.email.toLowerCase() === email.toLowerCase())) {
      return { alreadyExists: true };
    }
    const sub: NewsletterSub = {
      id: 'ns_' + Math.random().toString(36).substring(2, 11),
      email,
      subscribedAt: new Date().toISOString()
    };
    this.db.newsletter.push(sub);
    this.save();
    return sub;
  }

  deleteNewsletterSub(id: string) {
    this.db.newsletter = this.db.newsletter.filter(n => n.id !== id);
    this.save();
    return true;
  }

  // Careers APIs
  getCareers() {
    return this.db.careers;
  }

  addJobListing(job: Omit<JobListing, 'id' | 'createdAt'>) {
    const listing: JobListing = {
      ...job,
      id: 'j_' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString()
    };
    this.db.careers.push(listing);
    this.save();
    return listing;
  }

  updateJobListing(id: string, updated: Partial<JobListing>) {
    const idx = this.db.careers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.db.careers[idx] = { ...this.db.careers[idx], ...updated };
      this.save();
      return this.db.careers[idx];
    }
    return null;
  }

  deleteJobListing(id: string) {
    this.db.careers = this.db.careers.filter(c => c.id !== id);
    this.save();
    return true;
  }

  // Applications APIs
  getApplications() {
    return this.db.applications;
  }

  addApplication(app: Omit<JobApplication, 'id' | 'status' | 'createdAt'>) {
    const newApp: JobApplication = {
      ...app,
      id: 'app_' + Math.random().toString(36).substring(2, 11),
      status: 'applied',
      createdAt: new Date().toISOString()
    };
    this.db.applications.push(newApp);
    this.save();
    return newApp;
  }

  updateApplicationStatus(id: string, status: JobApplication['status']) {
    const app = this.db.applications.find(a => a.id === id);
    if (app) {
      app.status = status;
      this.save();
      return app;
    }
    return null;
  }

  deleteApplication(id: string) {
    this.db.applications = this.db.applications.filter(a => a.id !== id);
    this.save();
    return true;
  }

  // Client User APIs
  getClients() {
    return this.db.clients;
  }

  getClientByEmail(email: string) {
    return this.db.clients.find(c => c.email.toLowerCase() === email.toLowerCase());
  }

  addClient(client: { name: string; email: string; companyName: string; phone: string; passwordHash: string }) {
    const newClient: DbClientUser = {
      id: 'cli_' + Math.random().toString(36).substring(2, 11),
      name: client.name,
      email: client.email,
      companyName: client.companyName,
      phone: client.phone,
      passwordHash: client.passwordHash,
      createdAt: new Date().toISOString()
    };
    this.db.clients.push(newClient);
    this.save();
    return newClient;
  }

  // Client Projects APIs
  getClientProjects(clientId: string) {
    return this.db.clientProjects.filter(p => p.clientId === clientId);
  }

  getAllClientProjects() {
    return this.db.clientProjects;
  }

  addClientProject(project: Omit<ClientProject, 'id' | 'status' | 'createdAt'>) {
    const newProject: ClientProject = {
      ...project,
      id: 'proj_' + Math.random().toString(36).substring(2, 11),
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };
    this.db.clientProjects.push(newProject);
    this.save();
    return newProject;
  }

  updateClientProjectStatus(id: string, status: ClientProject['status']) {
    const project = this.db.clientProjects.find(p => p.id === id);
    if (project) {
      project.status = status;
      this.save();
      return project;
    }
    return null;
  }

  // Client Tickets APIs
  getClientTickets(clientId: string) {
    return this.db.clientTickets.filter(t => t.clientId === clientId);
  }

  getAllClientTickets() {
    return this.db.clientTickets;
  }

  addClientTicket(ticket: Omit<ClientTicket, 'id' | 'status' | 'createdAt' | 'replies'>) {
    const newTicket: ClientTicket = {
      ...ticket,
      id: 'tkt_' + Math.random().toString(36).substring(2, 11),
      status: 'open',
      createdAt: new Date().toISOString(),
      replies: []
    };
    this.db.clientTickets.push(newTicket);
    this.save();
    return newTicket;
  }

  addTicketReply(ticketId: string, reply: { sender: 'client' | 'support'; message: string }) {
    const ticket = this.db.clientTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.replies.push({
        sender: reply.sender,
        message: reply.message,
        createdAt: new Date().toISOString()
      });
      // automatically change status if support replied
      if (reply.sender === 'support') {
        ticket.status = 'in_progress';
      }
      this.save();
      return ticket;
    }
    return null;
  }

  updateTicketStatus(ticketId: string, status: ClientTicket['status']) {
    const ticket = this.db.clientTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = status;
      this.save();
      return ticket;
    }
    return null;
  }

  // Password Reset APIs
  getClientByResetToken(token: string) {
    return this.db.clients.find(c => c.resetToken === token);
  }

  getAdminByResetToken(token: string) {
    return this.db.admins.find(a => a.resetToken === token);
  }

  setClientResetToken(email: string, token: string, expires: string) {
    const client = this.getClientByEmail(email);
    if (client) {
      client.resetToken = token;
      client.resetTokenExpires = expires;
      this.save();
      return client;
    }
    return null;
  }

  setAdminResetToken(email: string, token: string, expires: string) {
    const admin = this.db.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (admin) {
      admin.resetToken = token;
      admin.resetTokenExpires = expires;
      this.save();
      return admin;
    }
    return null;
  }

  resetClientPassword(email: string, token: string, newPasswordHash: string) {
    const client = this.getClientByEmail(email);
    if (client && client.resetToken === token) {
      if (client.resetTokenExpires && new Date(client.resetTokenExpires) > new Date()) {
        client.passwordHash = newPasswordHash;
        client.resetToken = undefined;
        client.resetTokenExpires = undefined;
        this.save();
        return true;
      }
    }
    return false;
  }

  resetAdminPassword(email: string, token: string, newPasswordHash: string) {
    const admin = this.db.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (admin && admin.resetToken === token) {
      if (admin.resetTokenExpires && new Date(admin.resetTokenExpires) > new Date()) {
        admin.passwordHash = newPasswordHash;
        admin.resetToken = undefined;
        admin.resetTokenExpires = undefined;
        this.save();
        return true;
      }
    }
    return false;
  }

  setClientEmailVerified(email: string, verified: boolean) {
    const client = this.getClientByEmail(email);
    if (client) {
      client.emailVerified = verified;
      this.save();
      return true;
    }
    return false;
  }

  setAdminEmailVerified(email: string, verified: boolean) {
    const admin = this.db.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (admin) {
      admin.emailVerified = verified;
      this.save();
      return true;
    }
    return false;
  }

  // Services APIs
  getServices() {
    return this.db.services || [];
  }

  addService(service: Omit<Service, 'id'>) {
    const id = service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('s_' + Math.random().toString(36).substring(2, 11));
    const newService: Service = {
      ...service,
      id
    };
    if (!this.db.services) this.db.services = [];
    this.db.services.push(newService);
    this.save();
    return newService;
  }

  updateService(id: string, updated: Partial<Service>) {
    if (!this.db.services) this.db.services = [];
    const idx = this.db.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.db.services[idx] = { ...this.db.services[idx], ...updated };
      this.save();
      return this.db.services[idx];
    }
    return null;
  }

  deleteService(id: string) {
    if (!this.db.services) this.db.services = [];
    const initialLen = this.db.services.length;
    this.db.services = this.db.services.filter(s => s.id !== id);
    if (this.db.services.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Pricing Plan APIs
  getPricingPlans() {
    return this.db.pricingPlans || [];
  }

  addPricingPlan(plan: Omit<PricingPlan, 'id'>) {
    const id = plan.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('p_' + Math.random().toString(36).substring(2, 11));
    const newPlan: PricingPlan = {
      ...plan,
      id
    };
    if (!this.db.pricingPlans) this.db.pricingPlans = [];
    this.db.pricingPlans.push(newPlan);
    this.save();
    return newPlan;
  }

  updatePricingPlan(id: string, updated: Partial<PricingPlan>) {
    if (!this.db.pricingPlans) this.db.pricingPlans = [];
    const idx = this.db.pricingPlans.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.db.pricingPlans[idx] = { ...this.db.pricingPlans[idx], ...updated };
      this.save();
      return this.db.pricingPlans[idx];
    }
    return null;
  }

  deletePricingPlan(id: string) {
    if (!this.db.pricingPlans) this.db.pricingPlans = [];
    const initialLen = this.db.pricingPlans.length;
    this.db.pricingPlans = this.db.pricingPlans.filter(p => p.id !== id);
    if (this.db.pricingPlans.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
}

export const db = new LocalDatabase();
