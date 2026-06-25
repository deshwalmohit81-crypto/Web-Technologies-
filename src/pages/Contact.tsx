import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2, AlertTriangle, MessageSquare, ExternalLink, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactProps {
  preselectedService: string;
  setPreselectedService: (service: string) => void;
}

export default function Contact({ preselectedService, setPreselectedService }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Website Development');
  const [plan, setPlan] = useState('None');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !service) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          plan: plan !== 'None' ? plan : undefined,
          message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setPlan('None');
        setPreselectedService('');
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const services = [
    'Website Development',
    'E-Commerce Development',
    'Mobile App Development',
    'Software Development',
    'UI/UX Design',
    'SEO Services',
    'Digital Marketing',
    'Graphic Designing',
    'Website Maintenance',
    'Custom Business Solutions',
    'Custom Solution Bundle'
  ];

  const plans = ['None', 'Starter Plan (₹4,999)', 'Business Plan (₹9,999)', 'Professional Plan (₹19,999)', 'Enterprise Plan (Custom)'];

  return (
    <div id="contact-page" className="min-h-screen pt-24 relative overflow-hidden">
      {/* Glow layers */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left relative z-10 space-y-16">
        {/* Header */}
        <section id="contact-header" className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-slate-300">
            <span>24/7 COMMUNICATIONS DECK</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Schedule a Free <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              Technical Consultation
            </span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Ready to scale your business with robust web software? Complete the intake form below, or reach out directly to our solution architects via WhatsApp or Email. We usually reply with full layouts proposals within 12 hours.
          </p>
        </section>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form */}
          <section id="contact-form-container" className="lg:col-span-7 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 glass-panel space-y-6">
            <h3 className="text-lg font-display font-bold text-white tracking-wide">
              Intake Registration
            </h3>

            {status === 'success' && (
              <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-2xl p-4 flex items-start space-x-3 text-emerald-400 text-xs leading-relaxed font-sans">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <p className="font-semibold text-white">Inquiry Received Successfully!</p>
                  <p className="text-slate-400 mt-1">Our lead engineer, **Mohit Deshwal**, has registered your lead. We will review your requirements and call you back shortly. Thank you!</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-rose-950/20 border border-rose-800/30 rounded-2xl p-4 flex items-start space-x-3 text-rose-400 text-xs leading-relaxed font-sans">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <p className="font-semibold text-white">Inquiry Submission Failed</p>
                  <p className="text-slate-400 mt-1">An unexpected network error occurred. Please try submitting again, or connect directly on WhatsApp (+91 9389667600).</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-mono tracking-wider">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="Mohit Deshwal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-violet-500 rounded-xl px-4 py-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-mono tracking-wider">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    placeholder="deshwalmohit.81@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-violet-500 rounded-xl px-4 py-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-mono tracking-wider">CONTACT NUMBER</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9389667600"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-violet-500 rounded-xl px-4 py-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-mono tracking-wider">REQUIRED SERVICE</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-violet-500 rounded-xl px-4 py-3 text-white focus:outline-none cursor-pointer"
                  >
                    {services.map((srv, idx) => (
                      <option key={idx} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-mono tracking-wider">PRICING PLAN INTEREST</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-violet-500 rounded-xl px-4 py-3 text-white focus:outline-none cursor-pointer"
                >
                  {plans.map((pl, idx) => (
                    <option key={idx} value={pl}>{pl}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-mono tracking-wider">PROJECT OUTLINE / MESSAGE</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Outline your project requirements, goals, preferred timeline, and tech-stack details here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-violet-500 rounded-xl px-4 py-3 text-white focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors pt-3 disabled:bg-neutral-800"
              >
                <Send className="w-4 h-4" />
                <span>Submit Consultation Request</span>
              </button>
            </form>
          </section>

          {/* Right Column (Info + Mock Map) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Meta Information */}
            <section id="contact-info-panel" className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 glass-panel space-y-6">
              <h3 className="text-lg font-display font-bold text-white tracking-wide">
                Direct Channels
              </h3>
              <div className="space-y-4 font-sans text-xs">
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-500 font-mono tracking-wider text-[9px]">CALL / WHATSAPP</p>
                    <a href="tel:+919389667600" className="text-white hover:text-blue-400 font-semibold transition-colors mt-0.5 block">+91 9389667600</a>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-500 font-mono tracking-wider text-[9px]">OFFICIAL EMAIL</p>
                    <a href="mailto:deshwalmohit.81@gmail.com" className="text-white hover:text-blue-400 font-semibold transition-colors mt-0.5 block">deshwalmohit.81@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-fuchsia-600/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-500 font-mono tracking-wider text-[9px]">DOMAIN</p>
                    <a href="https://web.deshwal.in" target="_blank" rel="noreferrer" className="text-white hover:text-blue-400 font-semibold transition-colors mt-0.5 block">web.deshwal.in</a>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-500 font-mono tracking-wider text-[9px]">COORDINATES</p>
                    <span className="text-white font-semibold mt-0.5 block">Delhi-NCR, India</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Mock Dark Theme Interactive Map */}
            <section id="contact-map-panel" className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-4 glass-panel space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">NCR Corporate Node Mapping</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              {/* Custom styled vector canvas map */}
              <div className="h-52 rounded-2xl bg-neutral-950 border border-neutral-900 relative overflow-hidden flex items-center justify-center font-sans">
                {/* Visual gridlines */}
                <div className="absolute inset-0 bg-[radial-gradient(#252538_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                {/* Glowing marker */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-24 h-24 rounded-full bg-violet-600/15 border border-violet-500/10 animate-ping" />
                  <span className="absolute w-12 h-12 rounded-full bg-violet-600/35 border border-violet-500/20 animate-pulse" />
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 border border-white flex items-center justify-center shadow-lg relative z-10" />
                </div>
                {/* Metadata info */}
                <div className="absolute bottom-3 left-3 bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-2 text-[10px] text-slate-400 space-y-1 z-20">
                  <p className="text-white font-semibold tracking-wide">DESHWAL WEB TECHNOLOGIES</p>
                  <p>HQ: Delhi-NCR Pipeline Hub</p>
                  <p className="font-mono text-[9px] text-violet-400">Lat: 28.6139° N, Long: 77.2090° E</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
