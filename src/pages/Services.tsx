import { Code, ShoppingBag, Smartphone, Laptop, Figma, Search, Megaphone, Palette, Hammer, Settings, ArrowRight, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesProps {
  setTab: (tab: string) => void;
  setPreselectedService: (service: string) => void;
}

export default function Services({ setTab, setPreselectedService }: ServicesProps) {
  const serviceList = [
    {
      id: 'web-dev',
      icon: <Code className="w-6 h-6 text-violet-400" />,
      title: 'Website Development',
      desc: 'We engineer blazingly fast, modern websites using React 19, TypeScript, and Tailwind CSS. Fully responsive and optimized for the edge.',
      deliverables: ['Custom SPA / Landing Pages', 'Server Components Optimization', 'Fluid Framer Motion Loops', 'Semantic HTML5 structure'],
    },
    {
      id: 'ecommerce',
      icon: <ShoppingBag className="w-6 h-6 text-blue-400" />,
      title: 'E-Commerce Development',
      desc: 'Bespoke online retail platforms integrated with dynamic stock systems, advanced admin sales panels, and secure Razorpay gateway checkouts.',
      deliverables: ['Razorpay payment checkouts', 'Granular Inventory Panels', 'One-Click Customer Checkout', 'Sales telemetry tracking'],
    },
    {
      id: 'mobile-apps',
      icon: <Smartphone className="w-6 h-6 text-fuchsia-400" />,
      title: 'Mobile App Development',
      desc: 'Native-feeling cross-platform iOS and Android apps crafted securely using React Native, fast state synch, and offline support.',
      deliverables: ['Cross-platform mobile apps', 'Local SQLite Cache syncing', 'Firebase Push Notification hooks', 'Biometric login configs'],
    },
    {
      id: 'software-dev',
      icon: <Laptop className="w-6 h-6 text-emerald-400" />,
      title: 'Software Development',
      desc: 'Formulating robust corporate SaaS dashboards, custom cloud infrastructure, and backend Node.js APIs supporting secure compliance auditing.',
      deliverables: ['JWT Authentication systems', 'Throttling security rules', 'Relational SQLite/MongoDB DBs', 'Custom telemetry widgets'],
    },
    {
      id: 'ui-ux',
      icon: <Figma className="w-6 h-6 text-amber-400" />,
      title: 'UI/UX Design',
      desc: 'Transforming complex administrative workflows into beautiful, minimalist interactive layouts. Advanced Figma systems.',
      deliverables: ['High-Fidelity Figma prototypes', 'Grid and Typography scales', 'Comprehensive User flow wireframes', 'Interactive hover mockups'],
    },
    {
      id: 'seo',
      icon: <Search className="w-6 h-6 text-rose-400" />,
      title: 'SEO Services',
      desc: 'Aggressive technical optimization, schema markups, robotic indexing paths, and Sitemap creations to climb competitive search engine ranks.',
      deliverables: ['JSON-LD structured schema', 'Dynamic robots & sitemap files', 'Google Search Console syncing', 'Keywords competition reports'],
    },
    {
      id: 'digital-marketing',
      icon: <Megaphone className="w-6 h-6 text-sky-400" />,
      title: 'Digital Marketing',
      desc: 'Setting up automated customer funnels, social media advertisement integrations, and targeting campaigns to scale lead acquisition pipelines.',
      deliverables: ['Targeted social campaign layouts', 'Email automation synchronization', 'Google Analytics dashboard tracking', 'Lead Capture optimization'],
    },
    {
      id: 'graphic-design',
      icon: <Palette className="w-6 h-6 text-teal-400" />,
      title: 'Graphic Designing',
      desc: 'Premium vector branding graphics, corporate presentation layouts, custom logotypes, and digital media assets.',
      deliverables: ['Custom branding scale systems', 'Social media graphic bundles', 'High-impact pitch presentations', 'Scalable SVG logo vectors'],
    },
    {
      id: 'maintenance',
      icon: <Hammer className="w-6 h-6 text-indigo-400" />,
      title: 'Website Maintenance',
      desc: 'Routine security patch deployments, database backups, package version updates, and visual component tuning.',
      deliverables: ['Secure weekly server backups', 'Security audit evaluations', 'Page response-speed tuning', 'Asset optimization syncs'],
    },
    {
      id: 'custom-solutions',
      icon: <Settings className="w-6 h-6 text-orange-400" />,
      title: 'Custom Business Solutions',
      desc: 'Highly customized business solutions, including centralized ERPs, payroll tracking tools, CRM suites, and pipeline automations.',
      deliverables: ['Centralized SaaS ERP architectures', 'CRM automation modules', 'Granular employee permission matrices', 'Structured data logging'],
    },
  ];

  const handleInquire = (serviceName: string) => {
    setPreselectedService(serviceName);
    setTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="services-page" className="min-h-screen pt-24 relative overflow-hidden">
      {/* Background Neon effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left relative z-10 space-y-20">
        {/* Header */}
        <section id="services-header" className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-slate-300">
            <span>OFFICIAL BUSINESS SOLUTIONS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tighter">
            Comprehensive Suite of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Technology Solutions
            </span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            DESHWAL WEB TECHNOLOGIES PVT LTD delivers end-to-end consulting, engineering, and maintenance to cover the entire spectrum of corporate operations. Whether you are an early-stage startup or an established retail enterprise, we assemble custom agile workflows to fast-track your launch.
          </p>
        </section>

        {/* Services Grid */}
        <section id="services-grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceList.map((srv, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between group hover:border-blue-500/40 hover:bg-white/10 transition-all duration-300 hover:translate-y-[-4px]"
            >
              <div className="space-y-6">
                {/* Icon Wrapper */}
                <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  {srv.icon}
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-display font-bold text-white tracking-wide group-hover:text-blue-400 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    {srv.desc}
                  </p>
                </div>

                {/* Deliverables checklist */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Core Deliverables:
                  </p>
                  <ul className="space-y-1.5 text-xs text-gray-300 font-sans">
                    {srv.deliverables.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Inquire btn */}
              <div className="pt-8">
                <button
                  onClick={() => handleInquire(srv.title)}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                >
                  <span>Book {srv.title} Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Corporate trust banner */}
        <section id="services-trust-banner" className="bg-white/5 rounded-3xl p-10 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left items-center">
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-lg font-display font-bold text-white">Need a Bespoke Combined Contract?</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Our lead developer will assist in formulating consolidated solution bundles (e.g. Website Development + E-Commerce + Graphic Design + SEO alignment) to match your custom budget scope.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <button
              onClick={() => handleInquire('Custom Solution Bundle')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-full text-xs transition-colors cursor-pointer"
            >
              Consult Solution Architect
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
