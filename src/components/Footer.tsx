import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  setTab: (tab: string) => void;
}

export default function Footer({ setTab }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing to our newsletter!');
        setEmail('');
      } else if (response.status === 409) {
        setStatus('error');
        setMessage('You are already subscribed.');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  const handleLinkClick = (id: string) => {
    setTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#030014] border-t border-white/10 pt-20 pb-10 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Company Bio */}
          <div className="space-y-6">
            <div onClick={() => handleLinkClick('home')} className="flex items-center cursor-pointer group">
              <Logo showText={true} iconSize={40} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              We specialize in custom web architectures, high-performance e-commerce engines, native mobile apps, and custom business workflow systems for companies globally.
            </p>
            <div className="space-y-3 font-sans text-sm text-slate-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                <a href="tel:+919389667600" className="hover:text-white transition-colors duration-200">+91 9389667600</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                <a href="mailto:deshwalmohit.81@gmail.com" className="hover:text-white transition-colors duration-200">deshwalmohit.81@gmail.com</a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">Delhi-NCR, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-display font-semibold text-white text-base tracking-wide uppercase">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-slate-400 font-sans">
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-white hover:translate-x-1 transition-all duration-200">
                  Company Story
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white hover:translate-x-1 transition-all duration-200">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('portfolio')} className="hover:text-white hover:translate-x-1 transition-all duration-200">
                  Client Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('pricing')} className="hover:text-white hover:translate-x-1 transition-all duration-200">
                  Plans & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('careers')} className="hover:text-white hover:translate-x-1 transition-all duration-200">
                  Careers & Jobs
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('portal')} className="hover:text-white hover:translate-x-1 transition-all duration-200 text-blue-400 font-semibold">
                  Client Workspace
                </button>
              </li>
            </ul>
          </div>

          {/* Services Quick list */}
          <div className="space-y-6">
            <h4 className="font-display font-semibold text-white text-base tracking-wide uppercase">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-slate-400 font-sans">
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white hover:translate-x-1 transition-all duration-200">
                  Website Development
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white hover:translate-x-1 transition-all duration-200">
                  E-Commerce Design
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white hover:translate-x-1 transition-all duration-200">
                  iOS & Android Mobile Apps
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white hover:translate-x-1 transition-all duration-200">
                  Search Engine Optimization
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-white hover:translate-x-1 transition-all duration-200">
                  Custom ERP & BI Systems
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-6">
            <h4 className="font-display font-semibold text-white text-base tracking-wide uppercase">
              Newsletter
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Subscribe to stay updated with advanced insights on technology, trends, and growth tactics.
            </p>
            <form onSubmit={handleSubscribe} className="relative font-sans">
              <input
                type="email"
                placeholder="Your corporate email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-300 pr-12"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-1 top-1 bottom-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 text-white px-3 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {status === 'success' && (
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-sans">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-sans">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-mono space-y-4 md:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} DESHWAL WEB TECHNOLOGIES PVT LTD. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <button onClick={() => handleLinkClick('about')} className="hover:text-white transition-colors duration-200">About</button>
            <span>•</span>
            <button onClick={() => handleLinkClick('pricing')} className="hover:text-white transition-colors duration-200">Pricing</button>
            <span>•</span>
            <button onClick={() => handleLinkClick('contact')} className="hover:text-white transition-colors duration-200">Support</button>
            <span>•</span>
            <button onClick={() => handleLinkClick('portal')} className="hover:text-white text-blue-400 transition-colors duration-200">Client Portal</button>
            <span>•</span>
            <button onClick={() => handleLinkClick('admin')} className="hover:text-white text-fuchsia-400 transition-colors duration-200">Secure Access</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
