import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import WhatsAppFloating from './components/WhatsAppFloating.js';
import AiChatWidget from './components/AiChatWidget.js';

// Pages
import Home from './pages/Home.js';
import About from './pages/About.js';
import Services from './pages/Services.js';
import PortfolioPage from './pages/Portfolio.js';
import Pricing from './pages/Pricing.js';
import Contact from './pages/Contact.js';
import BlogPage from './pages/Blog.js';
import Careers from './pages/Careers.js';
import AdminPanel from './pages/AdminPanel.js';
import ClientPortal from './pages/ClientPortal.js';

import { Blog } from './types.js';

export default function App() {
  const [tab, setTab] = useState('home');
  const [preselectedService, setPreselectedService] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // Scroll to top on tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tab]);

  // Read URL hashes to support deep-linking if users navigate using browser location
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'about', 'services', 'portfolio', 'pricing', 'blog', 'careers', 'contact', 'admin', 'portal'].includes(hash)) {
        setTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial check
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetTab = (newTab: string) => {
    setTab(newTab);
    window.location.hash = newTab;
  };

  const renderActivePage = () => {
    switch (tab) {
      case 'home':
        return <Home setTab={handleSetTab} setSelectedBlog={setSelectedBlog} />;
      case 'about':
        return <About />;
      case 'services':
        return <Services setTab={handleSetTab} setPreselectedService={setPreselectedService} />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'pricing':
        return <Pricing />;
      case 'blog':
        return <BlogPage selectedBlog={selectedBlog} setSelectedBlog={setSelectedBlog} />;
      case 'careers':
        return <Careers />;
      case 'contact':
        return <Contact preselectedService={preselectedService} setPreselectedService={setPreselectedService} />;
      case 'admin':
        return <AdminPanel />;
      case 'portal':
        return <ClientPortal setTab={handleSetTab} />;
      default:
        return <Home setTab={handleSetTab} setSelectedBlog={setSelectedBlog} />;
    }
  };

  return (
    <div className="bg-[#030014] text-white min-h-screen relative font-sans selection:bg-violet-600 selection:text-white overflow-hidden">
      {/* Background Neon Glow Vectors from Bento Theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Universal Grid Layout and Navigation */}
      <Navbar currentTab={tab} setTab={handleSetTab} />

      {/* Main Dynamic View wrapper with layout margins */}
      <main className="pb-12 min-h-[calc(100vh-200px)] relative z-10">
        {renderActivePage()}
      </main>

      {/* Persistent Corporate Footer */}
      <Footer setTab={handleSetTab} />

      {/* Persistent Floating Client Connectors */}
      <WhatsAppFloating />
      <AiChatWidget />
    </div>
  );
}
