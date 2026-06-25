import { useEffect, useState } from 'react';
import { ArrowUpRight, Zap, Code, ShieldCheck, Users, Clock, Award, Star, Quote, ChevronRight, Activity, Cpu, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { Blog, Portfolio } from '../types.js';

interface HomeProps {
  setTab: (tab: string) => void;
  setSelectedBlog: (blog: Blog | null) => void;
}

export default function Home({ setTab, setSelectedBlog }: HomeProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    team: 0,
    satisfaction: 0,
  });

  // Load portfolio and blogs
  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => setBlogs(data.slice(0, 3)))
      .catch(() => {});

    fetch('/api/portfolios')
      .then((res) => res.json())
      .then((data) => setPortfolios(data.filter((p: Portfolio) => p.featured).slice(0, 3)))
      .catch(() => {});

    // Animate stats counter
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setStats({
        projects: Math.floor((320 / steps) * currentStep),
        clients: Math.floor((120 / steps) * currentStep),
        team: Math.floor((25 / steps) * currentStep),
        satisfaction: Math.floor((99 / steps) * currentStep),
      });

      if (currentStep >= steps) {
        setStats({
          projects: 320,
          clients: 120,
          team: 25,
          satisfaction: 99,
        });
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const coreServices = [
    { icon: <Code className="w-6 h-6 text-violet-400" />, title: 'Website Development', desc: 'High-speed, SEO-ready single page applications and administrative portals.' },
    { icon: <Zap className="w-6 h-6 text-blue-400" />, title: 'E-Commerce Stores', desc: 'Secure retail solutions integrated with automated inventory tracking and Razorpay.' },
    { icon: <Cpu className="w-6 h-6 text-fuchsia-400" />, title: 'Mobile Applications', desc: 'Native-feeling cross-platform mobile products built using React Native.' },
    { icon: <Activity className="w-6 h-6 text-emerald-400" />, title: 'Custom Business Software', desc: 'Bespoke corporate ERPs, automation web tools, and compliance reporting panels.' },
  ];

  const testimonials = [
    {
      name: 'Dr. Vivek Sharma',
      role: 'Founder, Zenith Healthcare',
      content: 'Deshwal Web Technologies built our native telemedicine app. The video synchronization and appointment scheduler are completely flawless. Our consult volume increased by 70%.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Rohan Gupta',
      role: 'COO, Apex Retail Group',
      content: 'Rebuilding our legacy store into a modern React storefront with Deshwal dropped checkout lag to 1.2s. Our checkout abandonment rates decreased by 42%. Outstanding execution.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Director of Products, SaaSScale',
      content: 'The D3 telemetry dashboard Deshwal designed for us is visually stunning. Their Framer Motion integrations and premium dark mode interfaces look comparable to Stripe or Vercel.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <div id="home-page" className="relative min-h-screen pt-24 overflow-hidden">
      {/* Background Neon Glow Vectors */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section id="hero-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Info */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-mono tracking-wider text-blue-400 uppercase tracking-[0.15em]">
                India's Leading Tech Agency
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold text-white tracking-tighter leading-[1.1]"
            >
              Transforming Ideas Into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                Digital Success
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-400 leading-relaxed max-w-2xl font-sans"
            >
              Premium custom software development and digital marketing solutions tailored for global scale. Your vision, our engineering. At **DESHWAL WEB TECHNOLOGIES**, we sprint to scale your enterprise organic footfall.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <button
                id="hero-btn-get-started"
                onClick={() => setTab('contact')}
                className="px-8 py-3.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all shadow-xl shadow-white/10 flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <span>Get Started Now</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <button
                id="hero-btn-portfolio"
                onClick={() => setTab('portfolio')}
                className="py-3 px-8 border border-white/20 rounded-full hover:bg-white/10 transition-colors text-sm font-semibold text-white flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>View Case Studies</span>
              </button>
            </motion.div>
          </div>

          {/* Hero Right Interactive Dashboard Preview */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-left font-mono">
              {/* Window Controls */}
              <div className="flex space-x-1.5 mb-6">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* Code Line effects */}
              <div className="space-y-3.5 text-xs">
                <div className="text-purple-400">
                  <span className="text-slate-500">1</span> const agency = &quot;DESHWAL WEB&quot;;
                </div>
                <div className="text-blue-400">
                  <span className="text-slate-500">2</span> const status = &quot;SCALABLE_SUCCESS&quot;;
                </div>
                <div className="text-slate-400">
                  <span className="text-slate-500">3</span> const techStack = [&apos;React 19&apos;, &apos;TypeScript&apos;, &apos;AI&apos;];
                </div>
                <div className="text-slate-500 font-sans border-t border-white/10 my-4 pt-4 text-xs space-y-2">
                  <span className="font-mono text-blue-400 text-[11px] block tracking-wider font-bold">✦ ACTIVE EXPERTISE DISPATCHER</span>
                  <div className="grid grid-cols-2 gap-4 text-slate-300 font-mono mt-2">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest">PROJECTS</p>
                      <p className="text-lg font-bold text-blue-400 mt-1">150+</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all">
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest">SATISFACTION</p>
                      <p className="text-lg font-bold text-purple-400 mt-1">98%</p>
                    </div>
                  </div>
                </div>
                <div className="text-slate-500 text-[10px] flex items-center justify-between font-sans">
                  <span>Secure Sandbox Connection</span>
                  <span className="text-blue-400 font-mono">v4.2.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section (Bento Block Row) */}
      <section id="stats-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div id="stat-projects" className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10">
            <p className="text-4xl md:text-5xl font-display font-extrabold text-blue-400 font-mono tracking-tight">
              {stats.projects}+
            </p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-mono font-medium">
              Projects Completed
            </p>
          </div>
          <div id="stat-clients" className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-purple-500/30 hover:bg-white/10">
            <p className="text-4xl md:text-5xl font-display font-extrabold text-purple-400 font-mono tracking-tight">
              {stats.clients}+
            </p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-mono font-medium">
              Global Clients
            </p>
          </div>
          <div id="stat-team" className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/10">
            <p className="text-4xl md:text-5xl font-display font-extrabold text-indigo-400 font-mono tracking-tight">
              {stats.team}+
            </p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-mono font-medium">
              Expert Architects
            </p>
          </div>
          <div id="stat-satisfaction" className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/10">
            <p className="text-4xl md:text-5xl font-display font-extrabold text-emerald-400 font-mono tracking-tight">
              {stats.satisfaction}%
            </p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-mono font-medium">
              Client Satisfaction
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section id="services-overview-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] text-blue-400 font-mono font-bold">
              OUR EXPERTISE
            </h2>
            <h3 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              Bespoke Corporate Solutions
            </h3>
          </div>
          <button
            onClick={() => setTab('services')}
            className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center space-x-1.5 mt-4 md:mt-0 cursor-pointer group"
          >
            <span>Learn About All 10 Services</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreServices.map((srv, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 transition-all duration-300 group hover:bg-white/10 hover:border-blue-500/50 hover:translate-y-[-4px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                {srv.icon}
              </div>
              <h4 className="font-display font-bold text-lg text-white mb-3 group-hover:text-blue-400 transition-colors">
                {srv.title}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed font-sans mb-4">
                {srv.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us - Bento Grid Section */}
      <section id="why-choose-us-section" className="py-24 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] text-blue-400 font-mono font-bold">
              THE DESHWAL ADVANTAGE
            </h2>
            <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tighter">
              Engineering Value Beyond Code
            </h3>
            <p className="text-gray-400 text-sm">
              We coordinate technical mastery, performance optimization, and robust project governance to transform client software systems into a strategic growth driver.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bento Card 1: SEO Optimization */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-xl lg:col-span-2 flex flex-col justify-between group hover:border-blue-500/50 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-2xl font-display font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-colors duration-300">
                  SEO Optimization & Core Web Vitals
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xl font-sans">
                  Organic traffic is the foundation of digital scaling. Every website we compile undergoes strict technical auditing to guarantee flawless SEO markup, correct schema structures, and blazingly fast checkout transitions (Lighthouse metrics of 95+).
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-[10px] text-gray-500 font-mono">
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>SITEMAP ENGINE</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>SCHEMA MARKUP</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>COMPRESSION OPTIMIZED</span>
                </span>
              </div>
            </div>

            {/* Bento Card 2: 24/7 Consultation support */}
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 rounded-3xl p-8 backdrop-blur-lg flex flex-col justify-between group hover:border-purple-400/50 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-2xl font-display font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                  Dedicated Maintenance
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">
                  Technology is dynamic. We offer round-the-clock service support and rapid package synchronizations to ensure your corporate platform runs cleanly without runtime interruptions.
                </p>
              </div>
              <div className="text-[10px] font-mono text-purple-300 mt-8 tracking-wider">
                <span>REACTION GUARANTEE &lt; 2 HOURS</span>
              </div>
            </div>

            {/* Bento Card 3: Indian Startup Feel */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between group hover:border-fuchsia-400/50 transition-all duration-300 hover:bg-white/10">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-2xl font-display font-bold text-white group-hover:text-fuchsia-400 transition-colors duration-300">
                  Agile Tech Culture
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">
                  Operating with an Indian startup tenacity and global technical precision, we sprint in close proximity with your founders to design robust, fast-to-market software packages.
                </p>
              </div>
              <div className="text-[10px] font-mono text-gray-500 mt-8 tracking-widest">
                <span>100% TRANSPARENT CODEBASES</span>
              </div>
            </div>

            {/* Bento Card 4: Security Shield */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 lg:col-span-2 flex flex-col justify-between group hover:border-emerald-500/50 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-2xl font-display font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                  Secured & Robust Compliance Standard
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">
                  Enterprise client assets mandate high security. We implement cryptographic authentication (cryptographically signed JSON Web Tokens), clean CORS headers, request throttling layers, and secure database parameters to bulletproof your systems against unauthorized extraction.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-[10px] text-gray-500 font-mono">
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>JWT SECURE SHELL</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>XSS INJECTION SHIELD</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolios Section */}
      <section id="featured-portfolios-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] text-blue-400 font-mono font-bold">
              FEATURED CASE STUDIES
            </h2>
            <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tighter">
              Transformative Deployments
            </h3>
          </div>
          <button
            onClick={() => setTab('portfolio')}
            className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center space-x-1.5 mt-4 md:mt-0 cursor-pointer group"
          >
            <span>Browse Full Portfolio</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((port) => (
            <div
              key={port.id}
              onClick={() => setTab('portfolio')}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group cursor-pointer hover:border-blue-500/50 hover:bg-white/10 hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="h-52 relative overflow-hidden">
                <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-all duration-300 z-10" />
                <img
                  src={port.image}
                  alt={port.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-[#0a0a0a] border border-white/10 text-[10px] text-blue-400 font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full z-20">
                  {port.category}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <h4 className="text-lg font-display font-bold text-white group-hover:text-blue-400 transition-colors">
                  {port.title}
                </h4>
                <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-2">
                  {port.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {port.tags.slice(0, 3).map((t, i) => (
                    <span key={i} className="text-[9px] font-mono bg-white/5 border border-white/10 text-gray-300 px-2.5 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Slide section */}
      <section id="testimonials-section" className="py-24 relative overflow-hidden z-10 text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] text-blue-400 font-mono font-bold">
              CUSTOMER TESTIMONIALS
            </h2>
            <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tighter">
              What Our Partners Say
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between relative group hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300"
              >
                <Quote className="w-10 h-10 text-violet-500/10 absolute top-4 right-4" />
                <div className="space-y-4">
                  <div className="flex space-x-1">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans italic">
                    &quot;{test.content}&quot;
                  </p>
                </div>

                <div className="flex items-center space-x-3 mt-8 pt-4 border-t border-white/10">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-white tracking-wide">
                      {test.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {test.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Conversion Hub */}
      <section id="cta-conversion-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-center">
        <div className="relative rounded-3xl p-12 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20 flex flex-col items-center">
          {/* Internal gradient flash */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-blue-600 to-purple-600 blur-[120px] rounded-full opacity-20 pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10 flex flex-col items-center">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/70 font-mono font-bold tracking-widest">
              START YOUR PROJECT TODAY
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Ready to Launch Your Next Software Asset?
            </h3>
            <p className="text-white/80 text-sm max-w-xl font-sans">
              Schedule a fast consulting call with our core systems engineer. Let us draft your structural wireframes, discuss layout preferences, and compute optimization plans.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <button
                onClick={() => setTab('contact')}
                className="px-8 py-3.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all shadow-xl shadow-white/10 cursor-pointer"
              >
                Book Free Consultation
              </button>
              <button
                onClick={() => setTab('pricing')}
                className="py-3 px-8 border border-white/20 rounded-full hover:bg-white/10 transition-colors text-sm font-semibold text-white cursor-pointer"
              >
                Inquire Pricing Plans
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
