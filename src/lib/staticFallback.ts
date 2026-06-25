import { Blog, Portfolio, JobListing } from '../types.js';

export const FALLBACK_BLOGS: Blog[] = [
  {
    id: 'b1',
    title: 'The Future of Web Development: Key Trends for 2026',
    slug: 'future-of-web-development-2026',
    excerpt: 'Discover the latest paradigms shaping modern web development, from React 19 features to AI-augmented coding, server component optimizations, and Tailwind v4.',
    content: `### Introduction to the New Digital Era\n\nThe web development landscape is evolving at an unprecedented pace. As we head into 2026, companies are demanding faster load times, more fluid user interfaces, and deeper AI integrations. \n\nIn this article, we outline the major technologies and philosophies driving web development this year.\n\n---\n\n### 1. React 19 & Next.js 15 Foundations\nReact 19 has officially stabilized, bringing with it powerful features like:\n- **Server Actions**: Simplifying form submissions and data mutations directly from components.\n- **Improved Suspense**: Staggered loading states with zero layout shifts.\n- **The React Compiler**: Eliminating the need for manual \`useMemo\` and \`useCallback\` hook optimization.\n\nAt **DESHWAL WEB TECHNOLOGIES**, we have already transitioned our core boilerplate systems to React 19 to provide lightweight, blazingly fast client experiences.\n\n---\n\n### 2. Micro-Frontends and Server-Side Rendering (SSR)\nWhile Single Page Applications (SPAs) are excellent for specific workflows, hybrid models leveraging SSR and static generation are critical for modern SEO and instant loading times. High performance directly impacts search engine visibility, making SSR a priority for any growth-oriented startup.\n\n---\n\n### 3. Tailwind CSS v4 and Modern Layouts\nTailwind v4 introduces a streamlined compiler, custom themes out of the box, and native support for CSS variables. With features like container queries and enhanced grid systems, we can craft highly fluid layouts without writing a single line of redundant CSS.\n\n---\n\n### Conclusion\nEmbracing these advancements isn't just about using the latest tools—it is about creating robust, future-proof digital assets that drive conversions and increase user engagement. Partner with Deshwal Web Technologies to elevate your next project today!`,
    category: 'Web Development',
    author: 'Mohit Deshwal',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    createdAt: '2026-06-15T10:00:00Z'
  },
  {
    id: 'b2',
    title: 'Maximizing E-Commerce Conversions with UX Design',
    slug: 'maximize-ecommerce-conversions-ux',
    excerpt: 'A comprehensive guide to leveraging user experience principles, checkout optimizations, and speed metrics to turn casual browsers into loyal customers.',
    content: `### Why E-Commerce Conversions Fail\n\nDid you know that the average e-commerce shopping cart abandonment rate is over 70%? A major portion of this loss is due to friction in user experience, lack of payment options, or slow loading speeds.\n\n---\n\n### Key Pillars of Modern E-Commerce UX\n\n#### 1. Frictionless Checkout Flow\n- **One-Page Checkout**: Condense shipping, billing, and review into a single, clean layout.\n- **Guest Checkout**: Never force a user to create an account before buying.\n- **Express Payments**: Support digital wallets (UPI, Razorpay, GPay) to enable 2-click checkouts.\n\n#### 2. Mobile-First Optimization\nOver 60% of all online shopping occurs on mobile devices. If your web-store feels clunky or difficult to tap on mobile screens, you are losing more than half of your potential sales. Use fluid layouts, touch-optimized button targets, and high-quality optimized imagery.\n\n#### 3. Visual Trust & Security Elements\nTrust badges, clear security indicators (SSL certificates), transparent return policies, and instant support widgets (such as WhatsApp Live Chat) significantly reduce a buyer's risk perception.\n\n---\n\n### Elevate Your Online Sales\nAt **DESHWAL WEB TECHNOLOGIES**, we specialize in high-performance e-commerce development integrating custom portals, Razorpay gateway configurations, and CRM integrations to supercharge your sales velocity.`,
    category: 'E-Commerce',
    author: 'Mohit Deshwal',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    createdAt: '2026-06-20T11:30:00Z'
  },
  {
    id: 'b3',
    title: 'SEO Best Practices for Startups: A Step-by-Step Guide',
    slug: 'seo-best-practices-startups',
    excerpt: 'Learn how to configure schema markups, sitemaps, semantic HTML, and high-performance metrics to climb Google rankings and attract organic leads.',
    content: `### Startups and the SEO Challenge\n\nFor a new business, organic visibility is a superpower. Unlike paid ads, which stop driving traffic the moment your budget runs dry, a strong SEO framework continues to attract qualified leads for months and years.\n\n---\n\n### Step-by-Step Startup SEO Roadmap\n\n#### Step 1: Technical SEO Audit\nBefore writing a single piece of content, verify that your website is fully readable by Googlebot.\n- Use **semantic HTML5 elements** (\`<header>\`, \`<main>\`, \`<section>\`, \`<article>\`).\n- Implement dynamic **Meta Tags** and Open Graph (OG) tags for social media.\n- Deploy an XML **Sitemap** and set up a proper \`robots.txt\` file.\n\n#### Step 2: Site Performance Metrics\nGoogle utilizes Core Web Vitals to rank pages. Sites with slow loads or shifting elements are penalized. Focus on **Lighthouse scores of 95+**:\n- Compress and lazy-load all images.\n- Minimize Javascript bundles.\n- Host on fast, edge-cached servers like Cloud Run or Vercel.\n\n#### Step 3: Implement Structured Data Schema\nSchema markup tells search engines exactly what your content means. Add corporate schema, product schema, or FAQ schema to stand out with rich search results.\n\n---\n\n### Ready to Rank?\nOur dedicated SEO team at Deshwal Web Technologies implements end-to-end optimizations to help your brand conquer competitive keywords. Contact us for a free audit report!`,
    category: 'SEO',
    author: 'Mohit Deshwal',
    image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read',
    createdAt: '2026-06-22T09:15:00Z'
  }
];

export const FALLBACK_PORTFOLIOS: Portfolio[] = [
  {
    id: 'p1',
    title: 'Apex E-Commerce Hub',
    category: 'E-Commerce Stores',
    description: 'A premium, high-speed retail platform built with React and Express, integrated with automated inventory tracking and seamless Razorpay checkouts.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Node.js', 'Tailwind CSS', 'Razorpay', 'MongoDB'],
    client: 'Apex Retail Group',
    website: 'https://apex-retail-demo.web.deshwal.in',
    challenge: 'The client faced slow checkout load times (over 6 seconds) and high cart abandonment rates on their legacy PHP platform.',
    solution: 'We completely rebuilt the frontend using React 19 and Vite with Tailwind. The backend was restructured into a custom Express API proxying payments securely via Razorpay.',
    results: 'Checkout speeds dropped to under 1.2 seconds, causing a 42% surge in completed checkouts within the first month.',
    completionDate: '2026-04-12',
    featured: true
  },
  {
    id: 'p2',
    title: 'Zenith Healthcare App',
    category: 'Mobile Applications',
    description: 'A native-feeling cross-platform mobile application for doctor scheduling, instant tele-consultation, and prescription management.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    tags: ['React Native', 'Node.js', 'WebRTC', 'Firebase', 'Express'],
    client: 'Zenith Health Solutions',
    challenge: 'The lack of reliable telehealth options during emergencies forced patients to endure long hospital queues.',
    solution: 'We engineered a React Native mobile application integrated with WebRTC for reliable, encrypted video calls and push notifications via Firebase Cloud Messaging.',
    results: 'Successfully onboarded over 500 active doctors, cutting booking-to-consultation cycles by 70%.',
    completionDate: '2026-05-30',
    featured: true
  },
  {
    id: 'p3',
    title: 'Fintech Pro Solutions',
    category: 'Corporate Solutions',
    description: 'A secure, enterprise-grade business management portal with granular role-based permissions, digital invoicing, and compliance tracking.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'JWT Auth', 'MongoDB'],
    client: 'Fintech Capital Ltd',
    challenge: 'Manual compliance logging and legacy accounting methods resulted in regular bookkeeping discrepancies and audit friction.',
    solution: 'Created a central ERP and compliance portal with highly structured database logs, automated audit trails, and cryptographically signed JWT sessions.',
    results: 'Zero billing errors over two quarters, reducing external corporate auditing expenses by 35%.',
    completionDate: '2026-03-15',
    featured: false
  },
  {
    id: 'p4',
    title: 'SaaS Metrics Dashboard',
    category: 'Business Websites',
    description: 'A gorgeous, interactive real-time telemetry dashboard for monitoring cloud-native SaaS pipelines, analytics, and active user retention.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Framer Motion', 'Tailwind v4', 'D3.js', 'WebSockets'],
    client: 'SaaSScale Inc',
    challenge: 'The SaaS company had high telemetry churn because their legacy charts were static and failed to present complex user journeys clearly.',
    solution: 'We designed a custom interactive visualization engine using D3.js and Framer Motion, presenting real-time WebSocket feeds with premium transitions.',
    results: 'Onboarded as their core client-facing analytics suite, resulting in a 25% improvement in trial-to-paid conversion rates.',
    completionDate: '2026-02-10',
    featured: true
  }
];

export const FALLBACK_CAREERS: JobListing[] = [
  {
    id: 'j1',
    title: 'Senior Full Stack Developer',
    department: 'Technology',
    location: 'Remote (India)',
    type: 'Full-time',
    experience: '5+ Years',
    salary: '₹12,0,000 - ₹18,0,000 PA',
    description: 'We are seeking a senior technical engineer skilled in React, Node.js, Express, and cloud deployments to lead our core client projects.',
    requirements: [
      'Deep expertise in React 18/19, Next.js, and TypeScript.',
      'Robust experience building scalable backend services with Express.js and databases (MongoDB/Postgres).',
      'Familiarity with Tailwind CSS, Framer Motion, and layout engineering.',
      'Experience integrating payment architectures like Razorpay and secure JWT session controls.',
      'Strong leadership skills to guide junior and mid-level developers.'
    ],
    responsibilities: [
      'Architect, write, and deploy pristine, highly performant web applications.',
      'Review pull requests and ensure exceptional code quality across repositories.',
      'Collaborate with UI/UX design teams to translate wireframes into interactive layouts.',
      'Optimize platform metrics to sustain Lighthouse scores above 95.'
    ],
    active: true,
    createdAt: '2026-06-24T00:00:00Z'
  },
  {
    id: 'j2',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote (India)',
    type: 'Full-time',
    experience: '3+ Years',
    salary: '₹6,0,000 - ₹10,0,000 PA',
    description: 'We are looking for a creative UI/UX designer to translate complex technical workflows into beautiful, minimalist, high-converting interfaces.',
    requirements: [
      'Solid portfolio demonstrating advanced user research, typography pairing, and visual layout crafting.',
      'Expert command of Figma, mockups, design systems, and vector components.',
      'Understanding of Tailwind CSS grids and layouts to collaborate effectively with frontend coders.',
      'Ability to design dark-themed SaaS dashboards and high-conversion landing pages.'
    ],
    responsibilities: [
      'Conduct stakeholder interviews and build wireframes and high-fidelity interactive Figma prototypes.',
      'Define modern typography systems, color scales, and spacing frameworks.',
      'Iterate based on client feedback to deliver pixel-perfect user journeys.'
    ],
    active: true,
    createdAt: '2026-06-24T00:00:00Z'
  },
  {
    id: 'j3',
    title: 'Digital Marketing & SEO Specialist',
    department: 'Marketing',
    location: 'Remote (India)',
    type: 'Full-time',
    experience: '2+ Years',
    salary: '₹4,50,000 - ₹7,0,000 PA',
    description: 'Join our marketing squad to drive search rankings, optimize off-page SEO, manage campaigns, and capture high-converting business leads.',
    requirements: [
      'Proven history of improving organic search traffic for corporate domains.',
      'Excellent understanding of technical SEO, meta-tags, semantic markup, and sitemaps.',
      'Proficiency with Google Search Console, Google Analytics, and SEO keyword tracking suites.',
      'Experience managing lead capture funnels and newsletter campaign execution.'
    ],
    responsibilities: [
      'Perform on-page and technical SEO audits for client platforms.',
      'Execute off-page backlink strategies and keyword mapping pipelines.',
      'Deliver comprehensive weekly traffic and optimization performance metrics reports.'
    ],
    active: true,
    createdAt: '2026-06-24T00:00:00Z'
  }
];
