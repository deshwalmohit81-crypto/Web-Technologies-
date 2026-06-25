/**
 * Shared Type Definitions for DESHWAL WEB TECHNOLOGIES PVT LTD
 */

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  image: string;
  readTime: string;
  createdAt: string;
}

export interface Portfolio {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  client: string;
  website?: string;
  challenge: string;
  solution: string;
  results: string;
  completionDate: string;
  featured: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  plan?: string;
  message: string;
  status: 'pending' | 'contacting' | 'completed';
  createdAt: string;
}

export interface NewsletterSub {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  active: boolean;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  coverLetter: string;
  portfolioUrl?: string;
  status: 'applied' | 'reviewing' | 'interviewed' | 'rejected' | 'accepted';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  companyName: string;
  phone: string;
  createdAt: string;
}

export interface ClientProject {
  id: string;
  clientId: string;
  title: string;
  service: string;
  budget: string;
  description: string;
  status: 'pending_review' | 'proposal_sent' | 'in_development' | 'testing' | 'delivered';
  createdAt: string;
}

export interface ClientTicket {
  id: string;
  clientId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  replies: {
    sender: 'client' | 'support';
    message: string;
    createdAt: string;
  }[];
}

export interface DashboardStats {
  totalLeads: number;
  pendingLeads: number;
  totalSubs: number;
  totalBlogs: number;
  totalPortfolios: number;
  totalApplications: number;
  leadsByService: { service: string; count: number }[];
  leadsOverTime: { date: string; count: number }[];
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  desc: string;
  deliverables: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number | string;
  period: string;
  tagline: string;
  icon: string;
  features: string[];
  popular: boolean;
}

