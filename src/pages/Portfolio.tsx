import { useEffect, useState } from 'react';
import { Eye, ExternalLink, Calendar, User, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Portfolio } from '../types.js';
import { FALLBACK_PORTFOLIOS } from '../lib/staticFallback.js';

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCaseStudy, setActiveCaseStudy] = useState<Portfolio | null>(null);

  const categories = ['All', 'Business Websites', 'E-Commerce Stores', 'Mobile Applications', 'Corporate Solutions'];

  useEffect(() => {
    fetch('/api/portfolios')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPortfolios(data);
          setFilteredPortfolios(data);
        } else {
          setPortfolios(FALLBACK_PORTFOLIOS);
          setFilteredPortfolios(FALLBACK_PORTFOLIOS);
        }
      })
      .catch(() => {
        setPortfolios(FALLBACK_PORTFOLIOS);
        setFilteredPortfolios(FALLBACK_PORTFOLIOS);
      });
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredPortfolios(portfolios);
    } else {
      setFilteredPortfolios(portfolios.filter((p) => p.category === category));
    }
  };

  return (
    <div id="portfolio-page" className="min-h-screen pt-24 relative overflow-hidden">
      {/* Background Neon effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left relative z-10 space-y-16">
        {/* Header */}
        <section id="portfolio-header" className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-slate-300">
            <span>OFFICIAL WORK PORTFOLIO</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tighter">
            Our Completed <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Case Studies & Software
            </span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            Review detailed reports on how we transformed business concepts into high-converting digital realities. Click any project card to view its corresponding Challenge, Solution, and quantitative results.
          </p>
        </section>

        {/* Category Tabs */}
        <section id="portfolio-tabs-container" className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-[#030014] border-white font-bold'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Portfolios Grid */}
        <section id="portfolio-grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((port) => (
            <div
              key={port.id}
              onClick={() => setActiveCaseStudy(port)}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group cursor-pointer hover:border-blue-500/40 hover:bg-white/10 hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-56 relative overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/10 transition-colors duration-300 z-10" />
                  <img
                    src={port.image}
                    alt={port.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-[#0a0a0a] border border-white/10 text-[9px] font-mono font-bold text-blue-400 tracking-wider uppercase px-2.5 py-1 rounded-full z-20">
                    {port.category}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-blue-400 transition-colors">
                    {port.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-3">
                    {port.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-2 flex flex-col space-y-4">
                <div className="flex flex-wrap gap-1">
                  {port.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[9px] font-mono bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                  {port.tags.length > 3 && (
                    <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-purple-400 px-2 py-0.5 rounded">
                      +{port.tags.length - 3} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setActiveCaseStudy(port)}
                  className="w-full bg-white/5 border border-white/10 text-slate-300 py-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-2 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Case Study Report</span>
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Empty State */}
        {filteredPortfolios.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">No project blueprints found in this category.</p>
          </div>
        )}

        {/* Case Study Full Modal */}
        <AnimatePresence>
          {activeCaseStudy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-[#030014] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl text-left"
              >
                {/* Banner Image */}
                <div className="h-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-950/30 z-10" />
                  <img
                    src={activeCaseStudy.image}
                    alt={activeCaseStudy.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setActiveCaseStudy(null)}
                    className="absolute top-4 right-4 bg-neutral-950/80 border border-white/10 text-slate-400 hover:text-white p-2 rounded-full z-20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-4 left-6 bg-blue-600 border border-blue-500 text-[10px] font-mono font-bold text-white uppercase px-3 py-1 rounded-full z-20">
                    {activeCaseStudy.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  {/* Title & Metadata */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                      <span>{activeCaseStudy.title}</span>
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-gray-400">
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>Client: {activeCaseStudy.client}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>Date: {activeCaseStudy.completionDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {activeCaseStudy.description}
                  </p>

                  {/* Challenge, Solution, Results */}
                  <div className="space-y-6 border-t border-white/10 pt-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-400">
                        The Challenge
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        {activeCaseStudy.challenge}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-purple-400">
                        The Solution
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        {activeCaseStudy.solution}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-2">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Quantitative Results</span>
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">
                        {activeCaseStudy.results}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                    {activeCaseStudy.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* External link */}
                  {activeCaseStudy.website && (
                    <div className="pt-4 flex justify-end">
                      <a
                        href={activeCaseStudy.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-full text-xs flex items-center space-x-2 transition-all cursor-pointer"
                      >
                        <span>Launch Live Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
