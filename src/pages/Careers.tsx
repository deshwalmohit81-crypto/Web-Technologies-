import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Briefcase, DollarSign, ArrowRight, X, Mail, Phone, User, Link, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JobListing } from '../types.js';

export default function Careers() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<JobListing | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/careers')
      .then((res) => res.json())
      .then((data) => setJobs(data.filter((j: JobListing) => j.active)))
      .catch(() => {});
  }, []);

  const handleApply = (job: JobListing) => {
    setActiveJob(job);
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob || !name || !email || !phone || !coverLetter) return;

    setStatus('submitting');

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: activeJob.id,
          jobTitle: activeJob.title,
          name,
          email,
          phone,
          coverLetter,
          portfolioUrl: portfolioUrl || undefined,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setPhone('');
        setCoverLetter('');
        setPortfolioUrl('');
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  return (
    <div id="careers-page" className="min-h-screen pt-24 relative overflow-hidden">
      {/* Background Neon effects */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left relative z-10 space-y-16">
        {/* Header */}
        <section id="careers-header" className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-slate-300">
            <span>HUMAN CAPITAL & FUTURES</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tighter">
            Build the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Web & Cloud Software
            </span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            Join the elite engineering squadron at DESHWAL WEB TECHNOLOGIES PVT LTD. We collaborate in fully distributed agile sprints, solving complex backend pipelines, designing high-converting dashboards, and standardizing secure cloud architectures.
          </p>
        </section>

        {/* Listings Container */}
        <section id="careers-listings-container" className="space-y-6 max-w-4xl">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 ${
                expandedJobId === job.id ? 'border-blue-500/30' : 'hover:border-white/20'
              }`}
            >
              {/* Summary node */}
              <div
                onClick={() => toggleExpand(job.id)}
                className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-display font-bold text-white tracking-wide">
                    {job.title}
                  </h3>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-4 text-[11px] font-mono text-gray-400">
                    <span className="flex items-center space-x-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                      <span>{job.department} • {job.type}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{job.salary}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(job);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-full text-xs transition-colors cursor-pointer"
                  >
                    Apply Now
                  </button>
                  <button className="text-gray-400 hover:text-white p-2">
                    {expandedJobId === job.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Detail Node */}
              <AnimatePresence>
                {expandedJobId === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 bg-white/5 px-6 md:px-8 pb-8 pt-6 font-sans text-xs space-y-6"
                  >
                    {/* Description */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400">
                        About the Position
                      </h4>
                      <p className="text-gray-300 leading-relaxed font-sans text-xs">
                        {job.description}
                      </p>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-purple-400">
                        Key Requirements & Stack
                      </h4>
                      <ul className="space-y-1.5 text-gray-300 leading-relaxed font-sans">
                        {job.requirements.map((reqItem, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                            <span>{reqItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Responsibilities */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
                        Your Responsibilities
                      </h4>
                      <ul className="space-y-1.5 text-gray-300 leading-relaxed font-sans">
                        {job.responsibilities.map((respItem, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shrink-0 mt-1.5" />
                            <span>{respItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-gray-400 text-sm">No openings are listed right now. Check back soon!</p>
            </div>
          )}
        </section>

        {/* Application Modal Popup */}
        <AnimatePresence>
          {activeJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-[#030014] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl text-left relative overflow-hidden"
              >
                <button
                  onClick={() => setActiveJob(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-white/5 border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>

                {status === 'success' ? (
                  <div className="py-8 text-center space-y-6 font-sans">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-display font-bold text-white">Application Received!</h3>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                        Your profile was successfully registered under the **{activeJob.title}** queue. Our recruitment committee will evaluate your assets and contact you via email shortly.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveJob(null)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-full text-xs cursor-pointer"
                    >
                      Return to Careers
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-display font-bold text-white tracking-wide flex items-center gap-1.5">
                        <span>Apply: {activeJob.title}</span>
                        <Sparkles className="w-4 h-4 text-blue-400" />
                      </h3>
                      <p className="text-[10px] text-gray-500 font-mono">
                        DEPT: {activeJob.department} • {activeJob.location}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider block">FULL NAME</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="Mohit Deshwal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-mono tracking-wider block">EMAIL ADDRESS</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                              type="email"
                              required
                              placeholder="deshwalmohit.81@gmail.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-mono tracking-wider block">PHONE NUMBER</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                              type="text"
                              required
                              placeholder="+91 9389667600"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider block">RESUME / PORTFOLIO URL</label>
                        <div className="relative">
                          <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="url"
                            placeholder="https://myportfolio.com/or-resume-link"
                            value={portfolioUrl}
                            onChange={(e) => setPortfolioUrl(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider block">COVER LETTER</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Outline your tech experience, preferred libraries, and why you would be an exceptional fit for Deshwal Web Technologies..."
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-3xl px-4 py-3 text-white focus:outline-none resize-none leading-relaxed"
                        />
                      </div>

                      {status === 'error' && (
                        <p className="text-rose-400 text-[10px] leading-relaxed font-sans">
                          * Submission failed. Check connection parameters or try again.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-full text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors pt-3 disabled:bg-neutral-800"
                      >
                        {status === 'submitting' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Packet...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Job Application</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
