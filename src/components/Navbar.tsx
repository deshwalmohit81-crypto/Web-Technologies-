import { useState, useEffect } from 'react';
import { Menu, X, Phone, Compass, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export default function Navbar({ currentTab, setTab }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'blog', label: 'Blog' },
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact' },
    { id: 'portal', label: 'Client Portal' },
  ];

  const handleNavClick = (id: string) => {
    setTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/20 backdrop-blur-lg border-b border-white/10 py-4 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            id="navbar-logo-container"
            onClick={() => handleNavClick('home')}
            className="flex items-center cursor-pointer group"
          >
            <Logo showText={true} iconSize={40} />
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-full font-sans text-sm font-medium tracking-wide transition-all duration-300 relative ${
                  currentTab === item.id
                    ? 'text-white bg-white/5 border border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                {currentTab === item.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-1 left-4 right-4 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Call to Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Admin Quick Link */}
            <button
              id="nav-btn-admin"
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-full transition-all duration-300 flex items-center gap-1.5 text-xs ${
                currentTab === 'admin'
                  ? 'text-fuchsia-400 bg-fuchsia-950/30 border border-fuchsia-800/40'
                  : 'text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-950/10'
              }`}
              title="Admin Panel"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </button>

            <a
              id="nav-btn-whatsapp"
              href="https://wa.me/919389667600"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-emerald-600/10 hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
            >
              <Phone className="w-4 h-4" />
              <span>+91 9389667600</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Quick Admin for Mobile */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-full text-xs ${
                currentTab === 'admin' ? 'text-fuchsia-400' : 'text-slate-400'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-full bg-white/5 border border-white/10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <motion.div
          id="mobile-drawer-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden bg-[#030014]/95 backdrop-blur-xl border-b border-white/10 absolute top-full left-0 w-full py-6 px-4 shadow-2xl z-40"
        >
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl font-sans text-base font-medium tracking-wide transition-all duration-300 ${
                  currentTab === item.id
                    ? 'text-white bg-white/5 border border-white/10 pl-6'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
              <a
                href="https://wa.me/919389667600"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 py-3 rounded-full font-medium text-sm transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                <span>Call +91 9389667600</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
