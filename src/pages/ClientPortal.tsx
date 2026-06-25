import React, { useState, useEffect } from 'react';
import { 
  Lock, Mail, Phone, Briefcase, MessageSquare, Plus, Send, LogOut, 
  CheckCircle, AlertTriangle, Sparkles, Building, User, ChevronRight, 
  FileText, Shield, Key, ArrowRight, Loader2, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '../components/Logo';
import { ClientProject, ClientTicket } from '../types';

interface ClientPortalProps {
  setTab: (tab: string) => void;
}

export default function ClientPortal({ setTab }: ClientPortalProps) {
  // Authentication states
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('client_token'));
  const [clientUser, setClientUser] = useState<any | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');

  // UI Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Portal Content states
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'new-project' | 'support' | 'billing'>('projects');
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [tickets, setTickets] = useState<ClientTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<ClientTicket | null>(null);

  // New Project Form
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjService, setNewProjService] = useState('Web Development');
  const [newProjBudget, setNewProjBudget] = useState('₹1,50,000 - ₹3,00,000');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [projSuccess, setProjSuccess] = useState(false);

  // New Ticket Form
  const [newTktSubject, setNewTktSubject] = useState('');
  const [newTktMessage, setNewTktMessage] = useState('');
  const [tktSuccess, setTktSuccess] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  // Fetch client info, projects, tickets
  useEffect(() => {
    if (token) {
      fetchClientData();
    }
  }, [token]);

  const fetchClientData = async () => {
    try {
      setIsLoading(true);
      const resMe = await fetch('/api/client/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resMe.status === 401 || resMe.status === 403) {
        handleLogout();
        return;
      }
      const userData = await resMe.json();
      setClientUser(userData);

      // Fetch projects
      const resProj = await fetch('/api/client/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resProj.ok) {
        const projData = await resProj.json();
        setProjects(projData);
      }

      // Fetch tickets
      const resTkt = await fetch('/api/client/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resTkt.ok) {
        const tktData = await resTkt.json();
        setTickets(tktData);
        // refresh selected ticket details if open
        if (selectedTicket) {
          const updatedSelected = tktData.find((t: ClientTicket) => t.id === selectedTicket.id);
          if (updatedSelected) {
            setSelectedTicket(updatedSelected);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching client workspace data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!email || !password) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    if (!isLogin) {
      if (!name || !phone) {
        setAuthError('Name and Phone are required for account registration.');
        return;
      }
      if (password !== confirmPassword) {
        setAuthError('Passwords do not match.');
        return;
      }
    }

    try {
      setIsLoading(true);
      const endpoint = isLogin ? '/api/client/auth/login' : '/api/client/auth/signup';
      const body = isLogin 
        ? { email, password }
        : { name, email, companyName, phone, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error || 'Authentication failed. Please try again.');
        return;
      }

      localStorage.setItem('client_token', data.token);
      setToken(data.token);
      setClientUser(data.user);
      setAuthSuccess(isLogin ? 'Login successful! Welcome to your Workspace.' : 'Account created successfully!');
      
      // Clear forms
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setCompanyName('');
      setPhone('');
    } catch (err) {
      setAuthError('Server is currently unreachable. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    setToken(null);
    setClientUser(null);
    setProjects([]);
    setTickets([]);
    setSelectedTicket(null);
    setAuthError(null);
    setAuthSuccess(null);
  };

  // Submit new project request
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle || !newProjDesc) {
      alert('Please fill in the project title and description.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/client/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newProjTitle,
          service: newProjService,
          budget: newProjBudget,
          description: newProjDesc
        })
      });

      if (response.ok) {
        setProjSuccess(true);
        setNewProjTitle('');
        setNewProjDesc('');
        fetchClientData();
        setTimeout(() => {
          setProjSuccess(false);
          setActiveSubTab('projects');
        }, 2500);
      } else {
        alert('Failed to submit project request.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new support ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTktSubject || !newTktMessage) {
      alert('Please fill in the subject and message.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/client/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: newTktSubject,
          message: newTktMessage
        })
      });

      if (response.ok) {
        setTktSuccess(true);
        setNewTktSubject('');
        setNewTktMessage('');
        fetchClientData();
        setTimeout(() => {
          setTktSuccess(false);
        }, 2500);
      } else {
        alert('Failed to open ticket.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit reply to ticket
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage || !selectedTicket) return;

    try {
      const response = await fetch(`/api/client/tickets/${selectedTicket.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyMessage })
      });

      if (response.ok) {
        setReplyMessage('');
        fetchClientData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'proposal_sent':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'in_development':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'testing':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'open':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div id="client-portal-page" className="min-h-screen pt-28 pb-16 relative">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* 1. UNAUTHENTICATED MODE (Login / Registration Form) */}
      {!token ? (
        <div className="max-w-md mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6"
          >
            {/* Branding Header */}
            <div className="text-center space-y-3">
              <Logo showText={true} iconSize={48} className="justify-center" />
              <div className="space-y-1">
                <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
                  {isLogin ? 'Client Work Center' : 'Create Client Account'}
                </h1>
                <p className="text-xs text-slate-400 font-sans">
                  {isLogin 
                    ? 'Access your software projects, support desk, and documents.' 
                    : 'Sign up to kick off new agile engineering pipelines.'}
                </p>
              </div>
            </div>

            {/* Success & Error Badges */}
            <AnimatePresence mode="wait">
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </motion.div>
              )}
              {authSuccess && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs"
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{authSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Name Fields for Sign Up */}
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Acme Corp"
                        className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 99999 99999"
                        className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password for Sign Up */}
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl py-3.5 font-semibold text-sm tracking-wide shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>{isLogin ? 'Enter Workspace' : 'Submit Credentials'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Mode Footer */}
            <div className="border-t border-white/5 pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-sans"
              >
                {isLogin 
                  ? "Don't have a workspace? Request Account Access" 
                  : 'Already registered? Log in with credentials'}
              </button>
            </div>
          </motion.div>

          {/* Quick Demo Credentials Help */}
          <div className="text-center mt-6 text-[11px] text-gray-500 font-sans max-w-sm mx-auto bg-white/2 border border-white/5 p-3 rounded-2xl">
            💡 <span className="font-semibold text-slate-400">Dev Simulation Tip:</span> Feel free to register any fake business account! It will instantly generate standard database credentials inside our local sandbox.
          </div>
        </div>
      ) : (
        /* 2. AUTHENTICATED MODE (Active Client Dashboard) */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Controller Column */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-extrabold text-sm">
                    {clientUser?.name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white truncate max-w-[150px]">
                      {clientUser?.name || 'Loading client...'}
                    </h2>
                    <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest truncate">
                      {clientUser?.companyName || 'Corporate Client'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 space-y-2 text-xs text-slate-400 font-sans">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{clientUser?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{clientUser?.phone}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-xs text-slate-400 hover:text-red-400 rounded-xl py-2.5 font-sans font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Workspace</span>
                </button>
              </div>

              {/* Navigation Options */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-md space-y-1">
                <button
                  onClick={() => { setActiveSubTab('projects'); setSelectedTicket(null); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide font-sans transition-all ${
                    activeSubTab === 'projects' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Active Projects ({projects.length})</span>
                </button>

                <button
                  onClick={() => { setActiveSubTab('new-project'); setSelectedTicket(null); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide font-sans transition-all ${
                    activeSubTab === 'new-project' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Request New Project</span>
                </button>

                <button
                  onClick={() => { setActiveSubTab('support'); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide font-sans transition-all ${
                    activeSubTab === 'support' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Support Desks ({tickets.length})</span>
                </button>

                <button
                  onClick={() => { setActiveSubTab('billing'); setSelectedTicket(null); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide font-sans transition-all ${
                    activeSubTab === 'billing' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Billing & Invoices</span>
                </button>
              </div>

              {/* Status Header Help */}
              <div className="bg-white/2 border border-white/5 rounded-3xl p-4 text-[11px] text-slate-500 font-sans space-y-2">
                <div className="flex items-center space-x-2 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span>SLA Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  As an elite partner of Deshwal Web Technologies, you enjoy priority technical engineering queues and a dedicated project consultant.
                </p>
              </div>
            </div>

            {/* Dynamic Workspace Container Column */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Dynamic Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <div className="space-y-1">
                  <h1 className="text-xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>Deshwal Workspace Hub</span>
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </h1>
                  <p className="text-xs text-slate-400 font-sans">
                    Monitor agile deliverables, invoices, and direct tech support logs.
                  </p>
                </div>
                <button
                  onClick={fetchClientData}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs text-white transition-colors flex items-center space-x-2 self-start md:self-auto shrink-0 font-sans"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Sync Dashboard</span>
                </button>
              </div>

              {/* Sub-Tab View Switching logic */}
              <div className="min-h-[400px]">
                {isLoading && projects.length === 0 && tickets.length === 0 ? (
                  <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <>
                    {/* PROJECTS TAB */}
                    {activeSubTab === 'projects' && (
                      <div className="space-y-6">
                        {projects.length === 0 ? (
                          <div className="border border-dashed border-white/10 rounded-3xl p-12 text-center space-y-4">
                            <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
                            <div className="space-y-1">
                              <h3 className="text-sm font-bold text-slate-300">No Active Projects</h3>
                              <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
                                You do not currently have any active software development projects registered. Request one now!
                              </p>
                            </div>
                            <button
                              onClick={() => setActiveSubTab('new-project')}
                              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-xl text-white font-sans transition-colors"
                            >
                              Request Project Proposal
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects.map((proj) => (
                              <div 
                                key={proj.id} 
                                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all group"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                                      {proj.service}
                                    </span>
                                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${getStatusStyle(proj.status)}`}>
                                      {getStatusLabel(proj.status)}
                                    </span>
                                  </div>
                                  <h3 className="text-base font-extrabold text-white leading-tight group-hover:text-blue-400 transition-colors">
                                    {proj.title}
                                  </h3>
                                  <p className="text-xs text-slate-400 font-sans line-clamp-3 leading-relaxed">
                                    {proj.description}
                                  </p>
                                </div>

                                <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                                  <span>Budget: <span className="text-slate-300 font-semibold">{proj.budget}</span></span>
                                  <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* NEW PROJECT REQUEST TAB */}
                    {activeSubTab === 'new-project' && (
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
                        <div className="space-y-1">
                          <h2 className="text-lg font-display font-extrabold text-white">
                            Initiate Software Engineering Pipeline
                          </h2>
                          <p className="text-xs text-slate-400 font-sans">
                            Submit your tech specification below. Our team of software architects will compile a scope proposal within 12 business hours.
                          </p>
                        </div>

                        {projSuccess ? (
                          <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2">
                            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                            <h3 className="text-sm font-bold text-emerald-400">Project Spec Transmitted</h3>
                            <p className="text-xs text-slate-400 font-sans">
                              Your request has been filed and an automated alert has been dispatched to our engineering team.
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={handleCreateProject} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                  Project Name / Title *
                                </label>
                                <input
                                  type="text"
                                  value={newProjTitle}
                                  onChange={(e) => setNewProjTitle(e.target.value)}
                                  placeholder="e.g. Acme Mobile App"
                                  className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 font-sans"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                  Service Category *
                                </label>
                                <select
                                  value={newProjService}
                                  onChange={(e) => setNewProjService(e.target.value)}
                                  className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 font-sans"
                                >
                                  <option value="Web Development">Custom Web Development</option>
                                  <option value="E-Commerce Stores">E-Commerce Development</option>
                                  <option value="Mobile Applications">Mobile Applications</option>
                                  <option value="Enterprise Portals">CRM & Enterprise SaaS</option>
                                  <option value="Technical SEO">Technical SEO & Auditing</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Target Development Budget Bracket
                              </label>
                              <select
                                value={newProjBudget}
                                onChange={(e) => setNewProjBudget(e.target.value)}
                                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 font-sans"
                              >
                                <option value="Under ₹1,50,000">Under ₹1,50,000</option>
                                <option value="₹1,50,000 - ₹3,00,000">₹1,50,000 - ₹3,00,000</option>
                                <option value="₹3,00,000 - ₹6,00,000">₹3,00,000 - ₹6,00,000</option>
                                <option value="₹6,00,000+">₹6,00,000+ (Enterprise Scaled)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Project Scope & Specification Description *
                              </label>
                              <textarea
                                value={newProjDesc}
                                onChange={(e) => setNewProjDesc(e.target.value)}
                                rows={5}
                                placeholder="Please outline the goals, target pages, features, and external API integrations required..."
                                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 font-sans"
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={isLoading}
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center space-x-2 font-sans"
                            >
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <span>Submit Specification</span>
                                  <ChevronRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* SUPPORT TICKETS TAB */}
                    {activeSubTab === 'support' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* List Column */}
                        <div className="md:col-span-1 space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-md space-y-4">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                              Support Tickets
                            </h3>
                            
                            <button
                              onClick={() => { setSelectedTicket(null); }}
                              className="w-full py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-blue-400 hover:text-white rounded-xl transition-all flex items-center justify-center space-x-2 font-sans"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Create Ticket</span>
                            </button>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {tickets.length === 0 ? (
                                <p className="text-[10px] text-slate-500 text-center font-sans py-6">
                                  No tickets registered.
                                </p>
                              ) : (
                                tickets.map((tkt) => (
                                  <button
                                    key={tkt.id}
                                    onClick={() => setSelectedTicket(tkt)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs space-y-1 block ${
                                      selectedTicket?.id === tkt.id
                                        ? 'bg-blue-600/10 border-blue-500 text-white'
                                        : 'bg-white/2 border-white/5 hover:border-white/10 text-slate-300'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="font-bold truncate max-w-[100px] block font-sans">
                                        {tkt.subject}
                                      </span>
                                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${getStatusStyle(tkt.status)}`}>
                                        {tkt.status}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-sans truncate">
                                      ID: {tkt.id}
                                    </p>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Detail / Conversation Column */}
                        <div className="md:col-span-2">
                          {!selectedTicket ? (
                            /* New Ticket Creation Console */
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                              <div>
                                <h3 className="text-sm font-bold text-white">Create New Support Case</h3>
                                <p className="text-xs text-slate-400 font-sans">
                                  Log a technical issue or request assistance with server architectures.
                                </p>
                              </div>

                              {tktSuccess ? (
                                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2">
                                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                                  <h4 className="text-xs font-bold text-emerald-400">Support Case Logged</h4>
                                  <p className="text-[10px] text-slate-400 font-sans">
                                    Our SLA prioritizes technical queries. You will receive assistance within minutes.
                                  </p>
                                </div>
                              ) : (
                                <form onSubmit={handleCreateTicket} className="space-y-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                      Case Subject *
                                    </label>
                                    <input
                                      type="text"
                                      value={newTktSubject}
                                      onChange={(e) => setNewTktSubject(e.target.value)}
                                      placeholder="e.g. Domain SSL configuration issue"
                                      className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                      Detailed Message *
                                    </label>
                                    <textarea
                                      value={newTktMessage}
                                      onChange={(e) => setNewTktMessage(e.target.value)}
                                      rows={4}
                                      placeholder="Please clarify any error tracebacks, domain URLs, or deployment logs..."
                                      className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                                      required
                                    />
                                  </div>

                                  <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all font-sans"
                                  >
                                    Submit Ticket
                                  </button>
                                </form>
                              )}
                            </div>
                          ) : (
                            /* Live Conversation Board */
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 flex flex-col justify-between min-h-[400px]">
                              
                              {/* Ticket Header */}
                              <div className="pb-4 border-b border-white/5 flex items-center justify-between gap-4">
                                <div>
                                  <span className="text-[9px] text-slate-500 font-mono block">
                                    TICKET ID: {selectedTicket.id}
                                  </span>
                                  <h3 className="text-base font-bold text-white tracking-tight">
                                    {selectedTicket.subject}
                                  </h3>
                                </div>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shrink-0 ${getStatusStyle(selectedTicket.status)}`}>
                                  {getStatusLabel(selectedTicket.status)}
                                </span>
                              </div>

                              {/* Chat Logs */}
                              <div className="flex-1 space-y-4 max-h-[220px] overflow-y-auto pr-1">
                                {/* Original Message */}
                                <div className="space-y-1">
                                  <div className="text-[9px] text-blue-400 font-bold uppercase tracking-wider font-sans">
                                    {clientUser?.name} <span className="text-slate-500">(Client)</span>
                                  </div>
                                  <div className="bg-[#0a0a14] border border-white/5 p-3 rounded-2xl rounded-tl-none text-xs text-slate-300 font-sans whitespace-pre-line leading-relaxed max-w-[85%]">
                                    {selectedTicket.message}
                                  </div>
                                  <div className="text-[8px] text-slate-600 font-sans pl-1">
                                    {new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>

                                {/* Replies */}
                                {selectedTicket.replies?.map((reply, i) => (
                                  <div 
                                    key={i} 
                                    className={`space-y-1 flex flex-col ${reply.sender === 'client' ? 'items-start' : 'items-end'}`}
                                  >
                                    <div className="text-[9px] font-bold uppercase tracking-wider font-sans">
                                      {reply.sender === 'client' ? (
                                        <span className="text-blue-400">{clientUser?.name} (Client)</span>
                                      ) : (
                                        <span className="text-purple-400">DESHWAL SUPPORT (Admin)</span>
                                      )}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-xs font-sans whitespace-pre-line leading-relaxed max-w-[85%] ${
                                      reply.sender === 'client'
                                        ? 'bg-[#0a0a14] border border-white/5 text-slate-300 rounded-tl-none'
                                        : 'bg-blue-600 text-white rounded-tr-none'
                                    }`}>
                                      {reply.message}
                                    </div>
                                    <div className="text-[8px] text-slate-600 font-sans px-1">
                                      {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Form Reply Input */}
                              <form onSubmit={handleSendReply} className="pt-4 border-t border-white/5 flex gap-2">
                                <input
                                  type="text"
                                  value={replyMessage}
                                  onChange={(e) => setReplyMessage(e.target.value)}
                                  placeholder="Type assistance message..."
                                  className="flex-1 bg-[#0a0a14] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                                  required
                                />
                                <button
                                  type="submit"
                                  className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shrink-0 active:scale-95"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </form>

                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {/* BILLING & INVOICES TAB */}
                    {activeSubTab === 'billing' && (
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-6">
                        <div className="space-y-1">
                          <h2 className="text-lg font-display font-extrabold text-white">
                            Corporate Ledger & Billing Invoices
                          </h2>
                          <p className="text-xs text-slate-400 font-sans">
                            Review financial receipts, billing iterations, and downloadable contract documentation.
                          </p>
                        </div>

                        {/* Simulated Invoices List */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                                <th className="py-3 px-4">Invoice ID</th>
                                <th className="py-3 px-4">Date Filed</th>
                                <th className="py-3 px-4">Service Scope</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4">Ledger Status</th>
                                <th className="py-3 px-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans text-slate-300">
                              <tr className="hover:bg-white/2 transition-all">
                                <td className="py-4 px-4 font-mono font-semibold">INV-2026-0041</td>
                                <td className="py-4 px-4">June 24, 2026</td>
                                <td className="py-4 px-4">Platform Rebuilding Setup (Advance)</td>
                                <td className="py-4 px-4 font-semibold text-white">₹75,000</td>
                                <td className="py-4 px-4">
                                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    PAID
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <button 
                                    onClick={() => alert('PDF generation is simulated for this dev preview.')}
                                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                                  >
                                    Download PDF
                                  </button>
                                </td>
                              </tr>
                              <tr className="hover:bg-white/2 transition-all">
                                <td className="py-4 px-4 font-mono font-semibold">INV-2026-0038</td>
                                <td className="py-4 px-4">May 15, 2026</td>
                                <td className="py-4 px-4">UX Architecture Review Spec</td>
                                <td className="py-4 px-4 font-semibold text-white">₹35,000</td>
                                <td className="py-4 px-4">
                                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    PAID
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <button 
                                    onClick={() => alert('PDF generation is simulated for this dev preview.')}
                                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                                  >
                                    Download PDF
                                  </button>
                                </td>
                              </tr>
                              <tr className="hover:bg-white/2 transition-all">
                                <td className="py-4 px-4 font-mono font-semibold">INV-2026-0052</td>
                                <td className="py-4 px-4">June 25, 2026</td>
                                <td className="py-4 px-4">Cloud Migration & SSL Setup</td>
                                <td className="py-4 px-4 font-semibold text-white">₹18,500</td>
                                <td className="py-4 px-4">
                                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                                    PENDING
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <button 
                                    onClick={() => alert('Secure Razorpay payments are initialized inside your client portal. Contact billing admin for gateway links.')}
                                    className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black rounded-lg border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider transition-colors inline-block"
                                  >
                                    Pay Online
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Document Placeholders */}
                        <div className="border-t border-white/5 pt-6">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                            Active Corporate Agreements
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400 text-xs font-sans">
                            <div className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-8 h-8 text-blue-400 shrink-0" />
                                <div>
                                  <p className="font-semibold text-white truncate max-w-[150px]">Standard_SLA_2026.pdf</p>
                                  <p className="text-[10px] text-slate-500">Service Level Agreement • 4.2 MB</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => alert('SLA contract document download is simulated.')}
                                className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                              >
                                View
                              </button>
                            </div>

                            <div className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-8 h-8 text-indigo-400 shrink-0" />
                                <div>
                                  <p className="font-semibold text-white truncate max-w-[150px]">NDA_Corporate_Signed.pdf</p>
                                  <p className="text-[10px] text-slate-500">Non-Disclosure Agreement • 1.8 MB</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => alert('NDA contract document download is simulated.')}
                                className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
