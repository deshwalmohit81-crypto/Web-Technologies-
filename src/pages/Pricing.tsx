import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Check, HelpCircle, ArrowUpRight, Zap, Flame, Award, ShieldCheck, Mail, Phone, User, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PricingPlan } from '../types';

const FALLBACK_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 4999,
    period: 'One-time',
    tagline: 'Best for small businesses',
    icon: 'Zap',
    features: [
      'Basic Informational Website',
      '5 Responsive Pages',
      'Structured Contact Inquiry Form',
      'Standard Tailwind UI layout',
      'Free Domain Mapping (web.deshwal.in sub)',
      '1 Month Post-Launch Support',
    ],
    popular: false,
  },
  {
    id: 'business',
    name: 'Business Plan',
    price: 9999,
    period: 'One-time',
    tagline: 'Perfect for scaling ventures',
    icon: 'Flame',
    features: [
      'Dynamic Custom Website',
      'Self-Serve Administrative Panel',
      'On-page SEO Technical Alignment',
      'Google Search Console setup',
      'Up to 15 Responsive Pages',
      'Database persistent leads tracker',
      '3 Months Post-Launch Support',
    ],
    popular: true,
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    price: 19999,
    period: 'One-time',
    tagline: 'Complete e-commerce capability',
    icon: 'Award',
    features: [
      'High-speed E-Commerce Platform',
      'Razorpay Payments gateway integration',
      'Granular Inventory management',
      'Interactive administrative sales charts',
      'Custom corporate database models',
      'Technical SEO Schema configurations',
      '6 Months Dedicated Support',
    ],
    popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 'Custom',
    period: 'Bespoke contract',
    tagline: 'Bespoke corporate architecture',
    icon: 'ShieldCheck',
    features: [
      'Custom ERP & CRM architectures',
      'Bespoke Cloud Infrastructure (Cloud Run)',
      'Highly compliant secure JWT access controls',
      'Gemini AI chat solutions integrated',
      'Dedicated Developer & Solution Architect',
      '24/7 Reaction SLA guarantees',
      'Infinite Scale & Continuous Backups',
    ],
    popular: false,
  },
];

export default function Pricing() {
  const [activePlan, setActivePlan] = useState<PricingPlan | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'intake' | 'paying' | 'success' | 'error'>('idle');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/pricing');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPlans(data);
          } else {
            setPlans(FALLBACK_PLANS);
          }
        } else {
          setPlans(FALLBACK_PLANS);
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setPlans(FALLBACK_PLANS);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getIconWithColor = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Zap;
    let colorClass = 'text-blue-400';
    
    switch(iconName.toLowerCase()) {
      case 'zap':
        colorClass = 'text-blue-400';
        break;
      case 'flame':
        colorClass = 'text-fuchsia-400';
        break;
      case 'award':
        colorClass = 'text-violet-400';
        break;
      case 'shieldcheck':
      case 'shield-check':
        colorClass = 'text-emerald-400';
        break;
      default:
        colorClass = 'text-blue-400';
    }
    
    return <IconComponent className="w-5 h-5" />;
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setActivePlan(plan);
    setCheckoutStatus('intake');
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !userPhone || !activePlan) return;

    setIsLoading(true);
    setCheckoutStatus('paying');

    const cleanPrice = typeof activePlan.price === 'number' 
      ? activePlan.price 
      : (parseInt(activePlan.price.replace(/[^0-9]/g, ''), 10) || 49999);

    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: activePlan.name,
          price: cleanPrice,
          clientName: userName,
          clientEmail: userEmail,
          clientPhone: userPhone,
        }),
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrderDetails(orderData);
        
        // Simulate a payment processing delay
        setTimeout(() => {
          setIsLoading(false);
          setCheckoutStatus('success');
          setUserName('');
          setUserEmail('');
          setUserPhone('');
        }, 2200);
      } else {
        throw new Error();
      }
    } catch (err) {
      setIsLoading(false);
      setCheckoutStatus('error');
    }
  };

  return (
    <div id="pricing-page" className="min-h-screen pt-24 relative overflow-hidden">
      {/* Background Neon effects */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left relative z-10 space-y-16">
        {/* Header */}
        <section id="pricing-header" className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-slate-300">
            <span>TRANSPARENT PRICING SCALE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tighter">
            Plans Formulated for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Any Stage of Growth
            </span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            Choose a plan that fits your corporate scale. We deliver fixed-bid pricing with zero hidden expenses, comprehensive database security standards, and dedicated launch timelines.
          </p>
        </section>

        {plansLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs text-gray-400 font-mono">Loading Dynamic Pricing Catalog...</p>
          </div>
        ) : (
          /* Plans Grid */
          <section id="pricing-cards-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`bg-white/5 border rounded-3xl p-8 flex flex-col justify-between relative group transition-all duration-300 ${
                  plan.popular
                    ? 'border-purple-500/50 hover:border-purple-400 shadow-xl shadow-purple-500/5 hover:translate-y-[-4px]'
                    : 'border-white/10 hover:border-white/20 hover:translate-y-[-4px]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-mono text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-purple-400/25">
                    Most Popular
                  </span>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-blue-400">
                      {getIconWithColor(plan.icon)}
                    </div>
                    <h3 className="text-lg font-display font-bold text-white tracking-wide">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="py-2">
                    <span className="text-3xl font-display font-bold text-white tracking-tight font-mono">
                      {typeof plan.price === 'number' ? `₹${plan.price.toLocaleString('en-IN')}` : plan.price}
                    </span>
                    {typeof plan.price === 'number' && (
                      <span className="text-xs text-gray-400 font-mono ml-1">/{plan.period}</span>
                    )}
                    {typeof plan.price !== 'number' && (
                      <span className="text-xs text-gray-400 font-sans block mt-1">{plan.period}</span>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 pt-6 border-t border-white/10 text-xs text-gray-300 font-sans">
                    {Array.isArray(plan.features) && plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="pt-8">
                  <button
                    id={`btn-select-plan-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3.5 rounded-full text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>Select {plan.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Razorpay Integration Modal Flow */}
        <AnimatePresence>
          {checkoutStatus !== 'idle' && (
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
                {/* Close Button */}
                {checkoutStatus !== 'paying' && (
                  <button
                    onClick={() => setCheckoutStatus('idle')}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-white/5 border border-white/10 text-xs cursor-pointer"
                  >
                    Close
                  </button>
                )}

                {/* INTAKE PHASE */}
                {checkoutStatus === 'intake' && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-display font-bold text-white tracking-wide">
                        Inquire: {activePlan?.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-sans">
                        Provide your details to initiate payment authorization and secure lead mapping.
                      </p>
                    </div>

                    <form onSubmit={handleInitiatePayment} className="space-y-4 font-sans text-xs">
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider block">YOUR NAME</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="Mohit Deshwal"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider block">EMAIL ADDRESS</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="email"
                            required
                            placeholder="deshwalmohit.81@gmail.com"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono tracking-wider block">CONTACT PHONE</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="+91 9389667600"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-full text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors pt-3"
                      >
                        <span>Initiate Razorpay Authorization</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {/* PAYING PHASE (SIMULATING RAZORPAY WINDOW) */}
                {checkoutStatus === 'paying' && (
                  <div className="py-10 text-center space-y-6">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white tracking-wider font-mono">
                        OPENING RAZORPAY SECURE INGRESS...
                      </p>
                      <p className="text-xs text-gray-400 font-mono leading-relaxed">
                        Initializing transaction ID: <br />
                        <span className="text-purple-400 font-semibold">order_ref_{Math.random().toString(36).substring(7).toUpperCase()}</span>
                      </p>
                    </div>
                    {/* Simulated payment box */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 font-mono text-[10px] text-gray-400 text-left space-y-2">
                      <p className="text-slate-300 font-semibold border-b border-white/10 pb-1 flex justify-between">
                        <span>RAZORPAY CHECKOUT</span>
                        <span className="text-blue-400">TEST MODE</span>
                      </p>
                      <p>Company: DESHWAL WEB TECHNOLOGIES PVT LTD</p>
                      <p>Plan: {activePlan?.name}</p>
                      <p className="text-white">Amount: {typeof activePlan?.price === 'number' ? `₹${activePlan?.price?.toLocaleString('en-IN')}` : activePlan?.price}</p>
                    </div>
                  </div>
                )}

                {/* SUCCESS PHASE */}
                {checkoutStatus === 'success' && (
                  <div className="py-10 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle2 className="w-10 h-10 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-display font-bold text-white">
                        Transaction Completed!
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xs mx-auto">
                        Your payment inquiry for **{activePlan?.name}** was successfully received. Our lead architect, **Mohit Deshwal**, has mapped your inquiry and will call you on **{userPhone}** within 12 hours.
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-[10px] font-mono text-slate-500 space-y-1">
                      <p>Transaction ID: tx_{Math.random().toString(36).substring(2, 11).toUpperCase()}</p>
                      <p>Status: APPROVED & CONFIRMED</p>
                    </div>
                    <button
                      onClick={() => setCheckoutStatus('idle')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-full text-xs cursor-pointer transition-colors"
                    >
                      Return to Pricing
                    </button>
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
