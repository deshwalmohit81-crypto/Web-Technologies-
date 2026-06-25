import { Award, Compass, Heart, Users, Star, ArrowUpRight, ShieldCheck, Milestone } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const achievements = [
    { icon: <Award className="w-5 h-5 text-violet-400" />, title: 'ISO 9001:2015 Certified', desc: 'Compliant with global guidelines for secure, standard software development.' },
    { icon: <ShieldCheck className="w-5 h-5 text-blue-400" />, title: 'High Security Standard', desc: 'Implementing bank-grade JWT session controls and robust API CORS shields.' },
    { icon: <Users className="w-5 h-5 text-fuchsia-400" />, title: '120+ Brands Empowered', desc: 'Consulting for retail stores, healthcare startups, and modern SaaS ecosystems.' },
    { icon: <Milestone className="w-5 h-5 text-emerald-400" />, title: '320+ Projects Deployed', desc: 'Engineered clean custom solutions with consistent Lighthouse scores of 95+.' },
  ];

  const team = [
    {
      name: 'Mohit Deshwal',
      role: 'Founder & Chief Technology Officer',
      bio: 'Mohit is a veteran full-stack systems engineer who started Deshwal Web Technologies to bridge the gap between high-level client conceptual design and robust, high-performance Node/React builds.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      social: '@mohit_deshwal',
    },
    {
      name: 'Anjali Sharma',
      role: 'Head of UI/UX Engineering',
      bio: 'Anjali coordinates advanced visual research, custom typography scales, and high-fidelity wireframes in Figma to ensure every product looks as premium as modern Stripe applications.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      social: '@anjali_design',
    },
    {
      name: 'Rajesh Verma',
      role: 'Lead Cloud & DevOps Architect',
      bio: 'Rajesh is our server automation specialist who designs edge caching pathways, continuous integration configurations, and secure database deployments.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      social: '@rajesh_cloud',
    },
  ];

  const timeline = [
    { year: '2022', title: 'The Genesis', desc: 'Mohit Deshwal established a boutique tech agency, engineering high-speed custom script scripts and technical SEO integrations.' },
    { year: '2023', title: 'Team Scale & Mobilization', desc: 'Expanded into React Native mobile products and custom administrative SaaS portals, onboarding our first 50 enterprise accounts.' },
    { year: '2024', title: 'Incorporation & ISO Certification', desc: 'Formally incorporated as DESHWAL WEB TECHNOLOGIES PVT LTD. Standardized software delivery models with full ISO QA frameworks.' },
    { year: '2025', title: 'AI Integration & Razorpay Deployments', desc: 'Pioneered custom server-side Gemini integrations and high-volume e-commerce payment frameworks for retail corporations.' },
    { year: '2026', title: 'Global Tech Leadership', desc: 'Expanding globally, delivering premium SaaS-comparable digital assets with edge caching and extreme performance engineering.' },
  ];

  return (
    <div id="about-page" className="min-h-screen pt-24 relative overflow-hidden">
      {/* Glow layers */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left relative z-10 space-y-24">
        {/* Intro */}
        <section id="about-header" className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-slate-300">
            <span>ABOUT OUR ENTERPRISE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Transforming Ideas Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              Future-Proof Technologies
            </span>
          </h1>
          <p className="text-base text-slate-300 leading-relaxed font-sans">
            DESHWAL WEB TECHNOLOGIES PVT LTD was built on a single, core philosophy: delivering high-performance, visually gorgeous, and robustly secured digital assets that drive conversions. We are a collection of dedicated systems architects, graphic experts, and SEO analysts collaborating with global founders.
          </p>
        </section>

        {/* Mission Vision */}
        <section id="mission-vision-section" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-colors duration-300 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">Our Mission</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              To engineer highly compliant, premium software assets utilizing React, Node.js, and custom cloud models. We eliminate interface friction, maximize search engine discovery, and streamline commercial workflows so clients can scale smoothly without architectural tech debt.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-colors duration-300 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">Our Vision</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              To be globally recognized as a premier software development partner, establishing an Indian startup tech environment that meets international security, speed, and design standards, with 100% transparent and modular coding methodologies.
            </p>
          </div>
        </section>

        {/* Achievements Grid */}
        <section id="achievements-section" className="space-y-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-xs uppercase tracking-[0.2em] text-blue-400 font-mono font-bold">OUR CREDENTIALS</h2>
            <h3 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tighter">Milestones of Quality</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-blue-500/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-6">
                  {ach.icon}
                </div>
                <div>
                  <h4 className="text-base font-display font-bold text-white mb-2">{ach.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Horizontal / Vertical */}
        <section id="timeline-section" className="space-y-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-xs uppercase tracking-[0.2em] text-blue-400 font-mono font-bold">THE CHRONOLOGY</h2>
            <h3 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tighter">Our Growth Trajectory</h3>
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-6 pl-8 space-y-12 font-sans text-left">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Year Badge */}
                <div className="absolute -left-[53px] top-1 w-10 h-10 rounded-full bg-[#030014] border-2 border-blue-500 flex items-center justify-center font-mono font-bold text-xs text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {item.year}
                </div>
                {/* Info */}
                <div className="space-y-2">
                  <h4 className="text-lg font-display font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Profile Grid */}
        <section id="team-section" className="space-y-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-xs uppercase tracking-[0.2em] text-blue-400 font-mono font-bold">OUR HUMAN ARCHITECTURE</h2>
            <h3 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tighter">The Core Architects</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 bg-neutral-950/80 border border-white/10 text-[10px] font-mono text-blue-400 px-3 py-1 rounded-full">
                    {member.social}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h4 className="text-lg font-display font-bold text-white tracking-wide">{member.name}</h4>
                  <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">{member.role}</p>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
