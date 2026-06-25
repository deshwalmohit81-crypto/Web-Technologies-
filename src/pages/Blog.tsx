import { useEffect, useState } from 'react';
import { Search, Eye, Calendar, User, Clock, ChevronRight, X, BookOpen, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Blog } from '../types.js';

interface BlogProps {
  selectedBlog: Blog | null;
  setSelectedBlog: (blog: Blog | null) => void;
}

export default function BlogPage({ selectedBlog, setSelectedBlog }: BlogProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Web Development', 'E-Commerce', 'SEO'];

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setFilteredBlogs(data);
      })
      .catch(() => {});
  }, []);

  const handleSearchAndFilter = (query: string, category: string) => {
    setSearchQuery(query);
    setActiveCategory(category);

    let result = blogs;

    if (category !== 'All') {
      result = result.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    if (query.trim() !== '') {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    setFilteredBlogs(result);
  };

  // Safe markdown simplifier for blogs (renders headers, list items and links beautifully)
  const formatBlogBody = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('####')) {
        return <h5 key={idx} className="font-display font-semibold text-white text-sm mt-4 mb-2">{trimmed.replace('####', '').trim()}</h5>;
      }
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="font-display font-bold text-white text-base mt-6 mb-3 border-b border-neutral-900 pb-2">{trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={idx} className="font-display font-bold text-white text-lg mt-8 mb-4 border-b border-neutral-800 pb-2">{trimmed.replace('##', '').trim()}</h3>;
      }
      
      // List items
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        return (
          <div key={idx} className="flex items-start space-x-2 pl-3 my-2 text-slate-300">
            <span className="text-violet-500 mt-1.5 shrink-0">•</span>
            <span>{processInlineMarkdown(trimmed.substring(1).trim())}</span>
          </div>
        );
      }

      if (/^\d+\./.test(trimmed)) {
        const num = trimmed.match(/^\d+\./)?.[0] || '';
        return (
          <div key={idx} className="flex items-start space-x-2 pl-3 my-2 text-slate-300">
            <span className="text-violet-400 font-mono font-semibold shrink-0">{num}</span>
            <span>{processInlineMarkdown(trimmed.replace(/^\d+\./, '').trim())}</span>
          </div>
        );
      }

      // Default paragraph
      if (!trimmed) return <div key={idx} className="h-4" />;
      return <p key={idx} className="text-slate-300 leading-relaxed text-sm my-2.5 font-sans">{processInlineMarkdown(trimmed)}</p>;
    });
  };

  const processInlineMarkdown = (text: string) => {
    // Bold matching
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      // Inline Code rendering
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="text-violet-400 bg-white/5 border border-white/5 px-1 rounded font-mono text-[11px]">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const handleShare = () => {
    if (selectedBlog) {
      navigator.clipboard.writeText(window.location.origin + '#' + selectedBlog.slug);
      alert('Case study link copied to clipboard!');
    }
  };

  return (
    <div id="blog-page" className="min-h-screen pt-24 relative overflow-hidden">
      {/* Background Neon effects */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left relative z-10 space-y-12">
        {/* Header */}
        <section id="blog-header" className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-slate-300">
            <span>OFFICIAL KNOWLEDGE DESK</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Corporate Insights & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              Technology Intelligence
            </span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Explore advanced guides on React development, tech SEO audits, e-commerce scale techniques, and security standard setups compiled by DESHWAL PVT LTD.
          </p>
        </section>

        {/* Search & Filter bar */}
        <section id="blog-search-bar-container" className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-4 border-b border-neutral-900">
          {/* Search Input */}
          <div className="md:col-span-5 relative font-sans">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search guides, keywords..."
              value={searchQuery}
              onChange={(e) => handleSearchAndFilter(e.target.value, activeCategory)}
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-violet-500 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Categories */}
          <div className="md:col-span-7 flex flex-wrap gap-1.5 justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSearchAndFilter(searchQuery, cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-neutral-950 border-white font-semibold'
                    : 'bg-neutral-900 text-slate-400 border-neutral-800 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <section id="blog-grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => setSelectedBlog(blog)}
              className="bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden glass-panel group cursor-pointer hover:border-violet-500/25 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-52 relative overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-950/30 group-hover:bg-neutral-950/10 transition-colors z-10" />
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-neutral-950/90 border border-neutral-800 text-[9px] font-mono font-bold text-violet-400 tracking-wider uppercase px-2.5 py-1 rounded-full z-20">
                    {blog.category}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{blog.readTime}</span>
                    </span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-base font-display font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-sans">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-neutral-900 mt-4">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-violet-600/15 text-violet-400 flex items-center justify-center font-bold text-[10px] border border-violet-500/10 uppercase">
                    {blog.author.substring(0, 2)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans font-medium">{blog.author}</span>
                </div>
                <button
                  onClick={() => setSelectedBlog(blog)}
                  className="text-blue-400 group-hover:text-violet-400 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <span>Read Post</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 bg-neutral-950/40 rounded-3xl border border-neutral-900">
            <p className="text-slate-400 text-sm">No tech guides match your search query.</p>
          </div>
        )}

        {/* Immersive Reading Modal View */}
        <AnimatePresence>
          {selectedBlog && (
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
                className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl glass-panel-heavy text-left"
              >
                {/* Header Banner */}
                <div className="h-60 relative overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-950/30 z-10" />
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="absolute top-4 right-4 bg-neutral-950/80 border border-neutral-800 text-slate-400 hover:text-white p-2 rounded-xl z-20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-4 left-6 bg-violet-600 border border-violet-500 text-[10px] font-mono font-bold text-white uppercase px-3 py-1 rounded-full z-20">
                    {selectedBlog.category}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-8 space-y-6">
                  {/* Metadata */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight leading-snug">
                      {selectedBlog.title}
                    </h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-violet-400" />
                        <span>Author: {selectedBlog.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Date: {new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
                        <span>Read Time: {selectedBlog.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Blog parsed markup content */}
                  <div className="border-t border-neutral-900 pt-6">
                    {formatBlogBody(selectedBlog.content)}
                  </div>

                  {/* Actions footer */}
                  <div className="pt-6 border-t border-neutral-900 flex justify-between items-center">
                    <button
                      onClick={handleShare}
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 px-4.5 py-2.5 rounded-xl border border-neutral-800 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 text-violet-400" />
                      <span>Copy Article Link</span>
                    </button>

                    <button
                      onClick={() => setSelectedBlog(null)}
                      className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-semibold px-6 py-2.5 rounded-xl text-xs"
                    >
                      Close Article
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
