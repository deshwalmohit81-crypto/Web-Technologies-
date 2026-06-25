import React, { useState, useEffect } from 'react';
import { Lock, Mail, Phone, Calendar, Briefcase, FileText, Plus, Edit2, Trash2, LogOut, CheckCircle, AlertTriangle, Eye, Sparkles, Database, Users, TrendingUp, Cpu, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Blog, Portfolio, JobApplication, Lead, ClientProject, ClientTicket } from '../types.js';
import Logo from '../components/Logo';

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Stats
  const [stats, setStats] = useState({
    leads: 0,
    newsletter: 0,
    applications: 0,
    portfolios: 0,
    blogs: 0,
  });

  // Admin section state
  const [activeTab, setActiveTab] = useState<'leads' | 'newsletters' | 'applications' | 'portfolios' | 'blogs' | 'client-projects' | 'client-tickets'>('leads');

  // Database lists
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newsletters, setNewsletters] = useState<{ id: string; email: string; subscribedAt: string }[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [clientTickets, setClientTickets] = useState<ClientTicket[]>([]);

  // Detailed Modal View triggers
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [viewApp, setViewApp] = useState<JobApplication | null>(null);

  // Client workspace interactive states
  const [selectedAdminTicket, setSelectedAdminTicket] = useState<ClientTicket | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Portfolio Form editor modal trigger
  const [editingPort, setEditingPort] = useState<Partial<Portfolio> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);

  // Check storage on boot
  useEffect(() => {
    const savedToken = sessionStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      fetchDashboardData(savedToken);
    }
  }, []);

  const fetchDashboardData = async (authToken: string) => {
    const headers = { Authorization: `Bearer ${authToken}` };

    try {
      // Stats
      const statRes = await fetch('/api/admin/analytics', { headers });
      if (statRes.ok) {
        const statData = await statRes.json();
        setStats(statData.counts);
      }

      // Leads
      const leadRes = await fetch('/api/admin/leads', { headers });
      if (leadRes.ok) setLeads(await leadRes.json());

      // Newsletters
      const newsRes = await fetch('/api/admin/newsletter', { headers });
      if (newsRes.ok) setNewsletters(await newsRes.json());

      // Applications
      const appRes = await fetch('/api/admin/applications', { headers });
      if (appRes.ok) setApplications(await appRes.json());

      // Portfolios
      const portRes = await fetch('/api/portfolios');
      if (portRes.ok) setPortfolios(await portRes.json());

      // Blogs
      const blogRes = await fetch('/api/blogs');
      if (blogRes.ok) setBlogs(await blogRes.json());

      // Client Projects
      const clientProjRes = await fetch('/api/admin/client-projects', { headers });
      if (clientProjRes.ok) setClientProjects(await clientProjRes.json());

      // Client Tickets
      const clientTktRes = await fetch('/api/admin/client-tickets', { headers });
      if (clientTktRes.ok) {
        const tkts = await clientTktRes.json();
        setClientTickets(tkts);
        
        // Refresh selected ticket references
        if (selectedAdminTicket) {
          const updated = tkts.find((t: ClientTicket) => t.id === selectedAdminTicket.id);
          if (updated) setSelectedAdminTicket(updated);
        }
      }

    } catch (err) {
      handleLogout();
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, status: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/client-projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDashboardData(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/client-tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDashboardData(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedAdminTicket || !adminReplyText) return;
    try {
      const res = await fetch(`/api/client/tickets/${selectedAdminTicket.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: adminReplyText })
      });
      if (res.ok) {
        setAdminReplyText('');
        fetchDashboardData(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        sessionStorage.setItem('admin_token', data.token);
        fetchDashboardData(data.token);
        setUsername('');
        setPassword('');
      } else {
        const errData = await response.json();
        setLoginError(errData.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setLoginError('Server connection failure.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('admin_token');
  };

  // Delete handlers (using auth headers)
  const handleDeleteItem = async (endpoint: string, id: string) => {
    if (!token || !window.confirm('Are you absolutely sure you want to delete this resource?')) return;

    try {
      const res = await fetch(`/api/admin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchDashboardData(token);
      } else {
        alert('Deletion authorization rejected.');
      }
    } catch (err) {
      alert('Network failure processing deletion request.');
    }
  };

  // PORTFOLIO CREATE/UPDATE SUBMISSION
  const handlePortfolioSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingPort) return;

    const method = editingPort.id ? 'PUT' : 'POST';
    const endpoint = editingPort.id ? `/api/admin/portfolios/${editingPort.id}` : '/api/admin/portfolios';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingPort),
      });

      if (res.ok) {
        setEditingPort(null);
        fetchDashboardData(token);
      } else {
        alert('Could not synchronize portfolio modifications.');
      }
    } catch (err) {
      alert('Network error during serialization.');
    }
  };

  // BLOG CREATE/UPDATE SUBMISSION
  const handleBlogSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingBlog) return;

    const method = editingBlog.id ? 'PUT' : 'POST';
    const endpoint = editingBlog.id ? `/api/admin/blogs/${editingBlog.id}` : '/api/admin/blogs';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingBlog),
      });

      if (res.ok) {
        setEditingBlog(null);
        fetchDashboardData(token);
      } else {
        alert('Could not synchronize blog modifications.');
      }
    } catch (err) {
      alert('Network error during serialization.');
    }
  };

  return (
    <div id="admin-panel-page" className="min-h-screen pt-24 relative overflow-hidden text-left">
      {/* Background Glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* NON-AUTHENTICATED STATE */}
      {!token ? (
        <div className="max-w-md mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6"
          >
            {/* Header */}
            <div className="space-y-4 text-center flex flex-col items-center">
              <Logo showText={true} iconSize={48} className="mx-auto" />
              <div className="space-y-1 mt-2">
                <h2 className="text-xl font-display font-extrabold text-white tracking-tighter">
                  Secure Console Access
                </h2>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                  Administrator HQ
                </p>
              </div>
            </div>

            {loginError && (
              <div className="bg-rose-950/20 border border-rose-800/30 rounded-2xl p-4 flex items-start space-x-2.5 text-rose-400 text-xs leading-relaxed font-sans">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4 font-sans text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-mono tracking-wider">ADMIN USERNAME</label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full px-4 py-3 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-mono tracking-wider">ADMIN SECURE KEY</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full px-4 py-3 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-full text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors pt-3"
              >
                <span>Authorize Terminal Securely</span>
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        /* AUTHENTICATED STATE */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-12">
          {/* Dashboard Header */}
          <section id="admin-top-header" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Logo showText={true} iconSize={40} />
              <div className="space-y-1 md:border-l md:border-white/10 md:pl-4">
                <h1 className="text-2xl font-display font-extrabold text-white tracking-tighter flex items-center gap-2">
                  <span>Enterprise Admin HQ</span>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </h1>
                <p className="text-[10px] text-gray-500 font-mono">
                  System Status: Online • Node Engine Version: v20.10.0
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Flush Secure Session</span>
            </button>
          </section>

          {/* Stats Telemetry cards */}
          <section id="admin-stats-panels" className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300">
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Active Leads</p>
              <p className="text-2xl font-bold text-white mt-2 font-mono">{stats.leads}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300">
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Newsletters</p>
              <p className="text-2xl font-bold text-blue-400 mt-2 font-mono">{stats.newsletter}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300">
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Applications</p>
              <p className="text-2xl font-bold text-purple-400 mt-2 font-mono">{stats.applications}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300">
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Portfolios</p>
              <p className="text-2xl font-bold text-emerald-400 mt-2 font-mono">{stats.portfolios}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300">
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Insight Articles</p>
              <p className="text-2xl font-bold text-indigo-400 mt-2 font-mono">{stats.blogs}</p>
            </div>
          </section>

          {/* Tab Selection */}
          <section id="admin-tab-bar" className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
            {(['leads', 'newsletters', 'applications', 'portfolios', 'blogs', 'client-projects', 'client-tickets'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border ${
                  activeTab === tab
                    ? 'bg-white text-[#030014] border-white font-bold'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </section>

          {/* PANELS DATA CONTENT */}
          <section id="admin-data-workspace" className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 min-h-[400px]">
            {/* LEADS PANEL */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <h3 className="text-lg font-display font-extrabold text-white tracking-tighter">Client Leads Inquiry</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-sans text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 font-mono text-[10px] tracking-widest uppercase">
                        <th className="pb-3 pr-4">NAME</th>
                        <th className="pb-3 pr-4">SERVICE REQUIRED</th>
                        <th className="pb-3 pr-4">PHONE</th>
                        <th className="pb-3 pr-4">EMAIL</th>
                        <th className="pb-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="text-slate-300 hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-semibold text-white">{lead.name}</td>
                          <td className="py-3.5 text-blue-400 font-mono">{lead.service}</td>
                          <td className="py-3.5 font-mono">{lead.phone}</td>
                          <td className="py-3.5">{lead.email}</td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              onClick={() => setViewLead(lead)}
                              className="text-blue-400 hover:text-blue-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                            >
                              Open Details
                            </button>
                            <button
                              onClick={() => handleDeleteItem('leads', lead.id)}
                              className="text-rose-400 hover:text-rose-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {leads.length === 0 && (
                    <p className="text-slate-500 text-center py-12">No client leads logged in SQLite/JSON database.</p>
                  )}
                </div>
              </div>
            )}

            {/* NEWSLETTERS PANEL */}
            {activeTab === 'newsletters' && (
              <div className="space-y-6">
                <h3 className="text-lg font-display font-extrabold text-white tracking-tighter">Newsletter Subscribers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-sans text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 font-mono text-[10px] tracking-widest uppercase">
                        <th className="pb-3">EMAIL ADDRESS</th>
                        <th className="pb-3">SUBSCRIBED AT</th>
                        <th className="pb-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {newsletters.map((sub) => (
                        <tr key={sub.id} className="text-slate-300 hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-semibold text-white">{sub.email}</td>
                          <td className="py-3.5 font-mono text-slate-500">
                            {new Date(sub.subscribedAt).toLocaleString()}
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteItem('newsletter', sub.id)}
                              className="text-rose-400 hover:text-rose-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {newsletters.length === 0 && (
                    <p className="text-slate-500 text-center py-12">No newsletter subscribers in directory.</p>
                  )}
                </div>
              </div>
            )}

            {/* APPLICATIONS PANEL */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-display font-extrabold text-white tracking-tighter">Careers Applications Received</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-sans text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 font-mono text-[10px] tracking-widest uppercase">
                        <th className="pb-3">APPLICANT</th>
                        <th className="pb-3">JOB IDENTIFIER</th>
                        <th className="pb-3">PORTFOLIO CV URL</th>
                        <th className="pb-3">TELEPHONE</th>
                        <th className="pb-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {applications.map((app) => (
                        <tr key={app.id} className="text-slate-300 hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-semibold text-white">{app.name}</td>
                          <td className="py-3.5 text-purple-400 font-mono font-semibold">{app.jobTitle}</td>
                          <td className="py-3.5 text-blue-400 truncate max-w-xs font-mono">
                            {app.portfolioUrl ? (
                              <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="hover:underline">
                                {app.portfolioUrl}
                              </a>
                            ) : (
                              <span className="text-slate-600">Not provided</span>
                            )}
                          </td>
                          <td className="py-3.5 font-mono">{app.phone}</td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              onClick={() => setViewApp(app)}
                              className="text-blue-400 hover:text-blue-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                            >
                              Open CV Packet
                            </button>
                            <button
                              onClick={() => handleDeleteItem('applications', app.id)}
                              className="text-rose-400 hover:text-rose-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {applications.length === 0 && (
                    <p className="text-slate-500 text-center py-12">No talent applications received yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* PORTFOLIOS PANEL */}
            {activeTab === 'portfolios' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-display font-extrabold text-white tracking-tighter">Case Study Portfolios</h3>
                  <button
                    onClick={() =>
                      setEditingPort({
                        title: '',
                        client: '',
                        description: '',
                        challenge: '',
                        solution: '',
                        results: '',
                        tags: [],
                        category: 'Business Websites',
                        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
                        completionDate: '2026-01-01',
                        featured: true,
                      })
                    }
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-2.5 rounded-full text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Compile New Case Study</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-sans text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 font-mono text-[10px] tracking-widest uppercase">
                        <th className="pb-3">TITLE</th>
                        <th className="pb-3">CLIENT</th>
                        <th className="pb-3">CATEGORY</th>
                        <th className="pb-3">FEATURED</th>
                        <th className="pb-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {portfolios.map((port) => (
                        <tr key={port.id} className="text-slate-300 hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-semibold text-white">{port.title}</td>
                          <td className="py-3.5 font-mono text-slate-400">{port.client}</td>
                          <td className="py-3.5 text-blue-400 font-mono">{port.category}</td>
                          <td className="py-3.5 font-mono">{port.featured ? 'YES' : 'NO'}</td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              onClick={() => setEditingPort(port)}
                              className="text-emerald-400 hover:text-emerald-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                            >
                              Edit Blueprint
                            </button>
                            <button
                              onClick={() => handleDeleteItem('portfolios', port.id)}
                              className="text-rose-400 hover:text-rose-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BLOGS PANEL */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-display font-extrabold text-white tracking-tighter">Insights Guides Index</h3>
                  <button
                    onClick={() =>
                      setEditingBlog({
                        title: '',
                        slug: '',
                        excerpt: '',
                        content: '',
                        readTime: '5 min read',
                        author: 'Mohit Deshwal',
                        category: 'Web Development',
                        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
                      })
                    }
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-2.5 rounded-full text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Technical Article</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-sans text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 font-mono text-[10px] tracking-widest uppercase">
                        <th className="pb-3">TITLE</th>
                        <th className="pb-3">SLUG</th>
                        <th className="pb-3">CATEGORY</th>
                        <th className="pb-3">READ TIME</th>
                        <th className="pb-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {blogs.map((blog) => (
                        <tr key={blog.id} className="text-slate-300 hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-semibold text-white">{blog.title}</td>
                          <td className="py-3.5 font-mono text-slate-400">{blog.slug}</td>
                          <td className="py-3.5 text-blue-400 font-mono">{blog.category}</td>
                          <td className="py-3.5 font-mono">{blog.readTime}</td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              onClick={() => setEditingBlog(blog)}
                              className="text-emerald-400 hover:text-emerald-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                            >
                              Edit Article
                            </button>
                            <button
                              onClick={() => handleDeleteItem('blogs', blog.id)}
                              className="text-rose-400 hover:text-rose-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CLIENT PROJECTS PANEL */}
            {activeTab === 'client-projects' && (
              <div className="space-y-6">
                <h3 className="text-lg font-display font-extrabold text-white tracking-tighter">Client Portals: Active Projects</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-sans text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 font-mono text-[10px] tracking-widest uppercase">
                        <th className="pb-3 pr-4">PROJECT TITLE</th>
                        <th className="pb-3 pr-4">SERVICE</th>
                        <th className="pb-3 pr-4">BUDGET</th>
                        <th className="pb-3 pr-4">FILED DATE</th>
                        <th className="pb-3 pr-4">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {clientProjects.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                            No active client projects filed in database.
                          </td>
                        </tr>
                      ) : (
                        clientProjects.map((proj) => (
                          <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-4 pr-4">
                              <span className="font-semibold text-white block">{proj.title}</span>
                              <span className="text-[10px] text-slate-500 font-mono block">Client ID: {proj.clientId}</span>
                            </td>
                            <td className="py-4 pr-4 font-mono text-blue-400">{proj.service}</td>
                            <td className="py-4 pr-4 font-mono text-slate-400">{proj.budget}</td>
                            <td className="py-4 pr-4 text-slate-400">{new Date(proj.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 pr-4">
                              <select
                                value={proj.status}
                                onChange={(e) => handleUpdateProjectStatus(proj.id, e.target.value as any)}
                                className="bg-[#030014] border border-white/10 rounded-full px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 text-[11px] cursor-pointer"
                              >
                                <option value="pending_review">PENDING REVIEW</option>
                                <option value="proposal_sent">PROPOSAL SENT</option>
                                <option value="in_development">IN DEVELOPMENT</option>
                                <option value="testing">TESTING</option>
                                <option value="delivered">DELIVERED</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CLIENT SUPPORT TICKETS PANEL */}
            {activeTab === 'client-tickets' && (
              <div className="space-y-6">
                <h3 className="text-lg font-display font-extrabold text-white tracking-tighter">Client Portals: Tech Support Desk</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Tickets list */}
                  <div className="lg:col-span-1 space-y-3 bg-[#030014]/50 border border-white/5 rounded-2xl p-4 max-h-[450px] overflow-y-auto">
                    <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Cases Index
                    </h4>
                    {clientTickets.length === 0 ? (
                      <p className="text-[11px] text-slate-500 text-center py-6 font-sans">
                        No tech support tickets logged.
                      </p>
                    ) : (
                      clientTickets.map((tkt) => (
                        <button
                          key={tkt.id}
                          onClick={() => setSelectedAdminTicket(tkt)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs space-y-1 block ${
                            selectedAdminTicket?.id === tkt.id
                              ? 'bg-blue-600/10 border-blue-500 text-white'
                              : 'bg-white/2 border-white/5 hover:border-white/10 text-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-center gap-1">
                            <span className="font-bold truncate block">{tkt.subject}</span>
                            <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500 shrink-0">
                              {tkt.id}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate font-sans">
                            Client ID: {tkt.clientId}
                          </p>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-[9px] text-slate-600 font-sans">
                              {new Date(tkt.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              tkt.status === 'open' ? 'bg-red-500/10 text-red-400' :
                              tkt.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              {tkt.status}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Right Column - Conversation detail */}
                  <div className="lg:col-span-2">
                    {!selectedAdminTicket ? (
                      <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center space-y-3">
                        <MessageSquare className="w-8 h-8 text-slate-600" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-300">Select a Support Case</p>
                          <p className="text-[11px] text-slate-500 max-w-xs mx-auto font-sans leading-relaxed">
                            Click any support case from the index to review the logs, reply, or update status.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#030014]/50 border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between min-h-[450px]">
                        {/* Conversation Header */}
                        <div className="pb-3 border-b border-white/10 flex justify-between items-center gap-4">
                          <div>
                            <span className="text-[9px] text-slate-500 font-mono block">CASE ID: {selectedAdminTicket.id}</span>
                            <h4 className="text-sm font-bold text-white truncate max-w-[280px]">
                              {selectedAdminTicket.subject}
                            </h4>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <label className="text-[10px] text-slate-400 font-mono">STATUS:</label>
                            <select
                              value={selectedAdminTicket.status}
                              onChange={(e) => handleUpdateTicketStatus(selectedAdminTicket.id, e.target.value as any)}
                              className="bg-[#030014] border border-white/10 rounded-full px-2.5 py-1 text-white text-[10px] focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="open">OPEN</option>
                              <option value="in_progress">IN PROGRESS</option>
                              <option value="resolved">RESOLVED</option>
                            </select>
                          </div>
                        </div>

                        {/* Message Feed */}
                        <div className="flex-1 space-y-4 max-h-[220px] overflow-y-auto pr-1">
                          {/* Main Issue Description */}
                          <div className="space-y-1">
                            <span className="text-[9px] text-blue-400 font-bold uppercase font-sans">
                              Client <span className="text-slate-500">({selectedAdminTicket.clientId})</span>
                            </span>
                            <p className="bg-white/2 border border-white/5 p-3 rounded-2xl rounded-tl-none text-xs text-slate-300 font-sans whitespace-pre-line leading-relaxed max-w-[85%]">
                              {selectedAdminTicket.message}
                            </p>
                            <span className="text-[8px] text-slate-600 font-mono block pl-1">
                              {new Date(selectedAdminTicket.createdAt).toLocaleTimeString()}
                            </span>
                          </div>

                          {/* Replies */}
                          {selectedAdminTicket.replies?.map((reply, i) => (
                            <div 
                              key={i} 
                              className={`space-y-1 flex flex-col ${reply.sender === 'client' ? 'items-start' : 'items-end'}`}
                            >
                              <span className="text-[9px] font-bold uppercase font-sans">
                                {reply.sender === 'client' ? (
                                  <span className="text-blue-400">Client</span>
                                ) : (
                                  <span className="text-purple-400">Deshwal Support (Admin)</span>
                                )}
                              </span>
                              <p className={`p-3 rounded-2xl text-xs font-sans whitespace-pre-line leading-relaxed max-w-[85%] ${
                                reply.sender === 'client'
                                  ? 'bg-white/2 border border-white/5 text-slate-300 rounded-tl-none'
                                  : 'bg-blue-600 text-white rounded-tr-none'
                              }`}>
                                {reply.message}
                              </p>
                              <span className="text-[8px] text-slate-600 font-mono block">
                                {new Date(reply.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Reply Form */}
                        <form onSubmit={handleSendAdminReply} className="pt-3 border-t border-white/10 flex gap-2">
                          <input
                            type="text"
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            placeholder="Type assistant message..."
                            className="flex-1 bg-[#030014] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                            required
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all font-sans active:scale-95"
                          >
                            Send
                          </button>
                        </form>

                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* VIEW DETAILS DIALOGS */}
          <AnimatePresence>
            {/* Lead Modal */}
            {viewLead && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-[#030014] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl text-left font-sans text-xs space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="text-base font-display font-extrabold tracking-tighter text-white">Lead Details Packet</h3>
                    <button onClick={() => setViewLead(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <p>
                      <strong className="text-white font-semibold">Client Name:</strong> {viewLead.name}
                    </p>
                    <p>
                      <strong className="text-white font-semibold">Email:</strong> {viewLead.email}
                    </p>
                    <p>
                      <strong className="text-white font-semibold">Phone:</strong> {viewLead.phone}
                    </p>
                    <p>
                      <strong className="text-white font-semibold">Service:</strong> {viewLead.service}
                    </p>
                    {viewLead.plan && (
                      <p>
                        <strong className="text-white font-semibold">Plan Interest:</strong> {viewLead.plan}
                      </p>
                    )}
                    <p className="bg-white/5 border border-white/10 p-4 rounded-2xl leading-relaxed text-slate-400 mt-4 max-h-40 overflow-y-auto">
                      <strong className="text-white block mb-1 font-semibold">Message:</strong> {viewLead.message}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono pt-2">
                      Registered: {new Date(viewLead.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setViewLead(null)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-5 py-2.5 rounded-full text-xs cursor-pointer transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Application Modal */}
            {viewApp && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-[#030014] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl text-left font-sans text-xs space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="text-base font-display font-extrabold tracking-tighter text-white">Application Detail Packet</h3>
                    <button onClick={() => setViewApp(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <p>
                      <strong className="text-white font-semibold">Candidate:</strong> {viewApp.name}
                    </p>
                    <p>
                      <strong className="text-white font-semibold">Email:</strong> {viewApp.email}
                    </p>
                    <p>
                      <strong className="text-white font-semibold">Phone:</strong> {viewApp.phone}
                    </p>
                    <p>
                      <strong className="text-white font-semibold">Applying For:</strong> {viewApp.jobTitle}
                    </p>
                    {viewApp.portfolioUrl && (
                      <p>
                        <strong className="text-white font-semibold">CV Reference:</strong>{' '}
                        <a href={viewApp.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                          {viewApp.portfolioUrl}
                        </a>
                      </p>
                    )}
                    <p className="bg-white/5 border border-white/10 p-4 rounded-2xl leading-relaxed text-slate-400 mt-4 max-h-40 overflow-y-auto">
                      <strong className="text-white block mb-1 font-semibold">Cover Letter:</strong> {viewApp.coverLetter}
                    </p>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setViewApp(null)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-5 py-2.5 rounded-full text-xs cursor-pointer transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* PORTFOLIO EDITOR MODAL */}
            {editingPort && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-[#030014] border border-white/10 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-left text-xs font-sans space-y-6 max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="text-base font-display font-extrabold tracking-tighter text-white">
                      {editingPort.id ? 'Modify Case Study Blueprint' : 'Establish New Project Blueprint'}
                    </h3>
                    <button onClick={() => setEditingPort(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handlePortfolioSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider">PROJECT TITLE</label>
                        <input
                          type="text"
                          required
                          value={editingPort.title || ''}
                          onChange={(e) => setEditingPort({ ...editingPort, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider">CLIENT BRAND</label>
                        <input
                          type="text"
                          required
                          value={editingPort.client || ''}
                          onChange={(e) => setEditingPort({ ...editingPort, client: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider">CATEGORY</label>
                        <select
                          value={editingPort.category || 'Business Websites'}
                          onChange={(e) => setEditingPort({ ...editingPort, category: e.target.value })}
                          className="w-full bg-[#030014] border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Business Websites">Business Websites</option>
                          <option value="E-Commerce Stores">E-Commerce Stores</option>
                          <option value="Mobile Applications">Mobile Applications</option>
                          <option value="Corporate Solutions">Corporate Solutions</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider">COMPLETION DATE</label>
                        <input
                          type="date"
                          required
                          value={editingPort.completionDate || '2026-01-01'}
                          onChange={(e) => setEditingPort({ ...editingPort, completionDate: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono tracking-wider">COVER IMAGE URL</label>
                      <input
                        type="url"
                        required
                        value={editingPort.image || ''}
                        onChange={(e) => setEditingPort({ ...editingPort, image: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono tracking-wider">BRIEF DESCRIPTION</label>
                      <textarea
                        required
                        rows={2}
                        value={editingPort.description || ''}
                        onChange={(e) => setEditingPort({ ...editingPort, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono tracking-wider">THE CHALLENGE</label>
                      <textarea
                        required
                        rows={2}
                        value={editingPort.challenge || ''}
                        onChange={(e) => setEditingPort({ ...editingPort, challenge: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono tracking-wider">THE SOLUTION</label>
                      <textarea
                        required
                        rows={2}
                        value={editingPort.solution || ''}
                        onChange={(e) => setEditingPort({ ...editingPort, solution: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono tracking-wider">QUANTITATIVE RESULTS</label>
                      <textarea
                        required
                        rows={2}
                        value={editingPort.results || ''}
                        onChange={(e) => setEditingPort({ ...editingPort, results: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono tracking-wider">TAGS (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="React 19, TypeScript, Express, Secure JWT"
                        value={editingPort.tags?.join(', ') || ''}
                        onChange={(e) =>
                          setEditingPort({
                            ...editingPort,
                            tags: e.target.value.split(',').map((x) => x.trim()).filter((x) => x !== ''),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <input
                        type="checkbox"
                        id="feat-chk"
                        checked={editingPort.featured || false}
                        onChange={(e) => setEditingPort({ ...editingPort, featured: e.target.checked })}
                        className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <label htmlFor="feat-chk" className="text-slate-300 font-mono cursor-pointer select-none tracking-wider text-[10px]">
                        SHOW ON FEATURED HOMEPAGE CAROUSEL
                      </label>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingPort(null)}
                        className="bg-white/5 border border-white/10 text-gray-300 hover:text-white px-5 py-2.5 rounded-full cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-2.5 rounded-full cursor-pointer transition-colors"
                      >
                        Serialize & Save
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {/* BLOG EDITOR MODAL */}
            {editingBlog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-[#030014] border border-white/10 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-left text-xs font-sans space-y-6 max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="text-base font-display font-extrabold tracking-tighter text-white">
                      {editingBlog.id ? 'Modify Insight Article' : 'Draft New Technical Article'}
                    </h3>
                    <button onClick={() => setEditingBlog(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleBlogSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider">ARTICLE TITLE</label>
                        <input
                          type="text"
                          required
                          value={editingBlog.title || ''}
                          onChange={(e) => {
                            const titleStr = e.target.value;
                            const slugStr = titleStr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                            setEditingBlog({ ...editingBlog, title: titleStr, slug: slugStr });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider">URL SLUG</label>
                        <input
                          type="text"
                          required
                          value={editingBlog.slug || ''}
                          onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider">CATEGORY</label>
                        <select
                          value={editingBlog.category || 'Web Development'}
                          onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                          className="w-full bg-[#030014] border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Web Development">Web Development</option>
                          <option value="E-Commerce">E-Commerce</option>
                          <option value="SEO">SEO</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider">READ TIME (e.g. 5 min read)</label>
                        <input
                          type="text"
                          required
                          value={editingBlog.readTime || '5 min read'}
                          onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono tracking-wider">HERO IMAGE URL</label>
                      <input
                        type="url"
                        required
                        value={editingBlog.image || ''}
                        onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono tracking-wider">SUMMARY EXCERPT</label>
                      <textarea
                        required
                        rows={2}
                        value={editingBlog.excerpt || ''}
                        onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-mono tracking-wider">ARTICLE CONTENT (MARKDOWN SUPPORTED)</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Use markdown headers ### and bullet * checklists..."
                        value={editingBlog.content || ''}
                        onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
                      />
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingBlog(null)}
                        className="bg-white/5 border border-white/10 text-gray-300 hover:text-white px-5 py-2.5 rounded-full cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-2.5 rounded-full cursor-pointer transition-colors"
                      >
                        Publish Article
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
