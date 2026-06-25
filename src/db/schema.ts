import { pgTable, serial, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users / Clients / Admins table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').default('client').notNull(), // 'admin', 'editor', 'client'
  companyName: text('company_name'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Blogs table
export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  author: text('author').notNull(),
  image: text('image').notNull(),
  readTime: text('read_time').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Portfolios table
export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  client: text('client').notNull(),
  website: text('website'),
  challenge: text('challenge').default('').notNull(),
  solution: text('solution').default('').notNull(),
  results: text('results').default('').notNull(),
  completionDate: text('completion_date').default('').notNull(),
  featured: boolean('featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Leads table
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  service: text('service').notNull(),
  plan: text('plan'),
  message: text('message').notNull(),
  status: text('status').default('pending').notNull(), // 'pending' | 'contacting' | 'completed'
  createdAt: timestamp('created_at').defaultNow(),
});

// Newsletter subscribers table
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
});

// Job listings (careers) table
export const careers = pgTable('careers', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  department: text('department').notNull(),
  location: text('location').notNull(),
  type: text('type').notNull(), // 'Full-time' | 'Part-time' | 'Contract' | 'Remote'
  experience: text('experience').notNull(),
  salary: text('salary').notNull(),
  description: text('description').notNull(),
  requirements: jsonb('requirements').$type<string[]>().default([]).notNull(),
  responsibilities: jsonb('responsibilities').$type<string[]>().default([]).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Job Applications table
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  jobId: text('job_id').notNull(),
  jobTitle: text('job_title').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  resumeUrl: text('resume_url'),
  coverLetter: text('cover_letter').notNull(),
  portfolioUrl: text('portfolio_url'),
  status: text('status').default('applied').notNull(), // 'applied' | 'reviewing' | 'interviewed' | 'rejected' | 'accepted'
  createdAt: timestamp('created_at').defaultNow(),
});

// Client Projects table
export const clientProjects = pgTable('client_projects', {
  id: serial('id').primaryKey(),
  clientId: text('client_id').notNull(), // references users.uid
  title: text('title').notNull(),
  service: text('service').notNull(),
  budget: text('budget').notNull(),
  description: text('description').notNull(),
  status: text('status').default('pending_review').notNull(), // 'pending_review' | 'proposal_sent' | 'in_development' | 'testing' | 'delivered'
  createdAt: timestamp('created_at').defaultNow(),
});

// Client Tickets table
export const clientTickets = pgTable('client_tickets', {
  id: serial('id').primaryKey(),
  clientId: text('client_id').notNull(), // references users.uid
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('open').notNull(), // 'open' | 'in_progress' | 'resolved'
  createdAt: timestamp('created_at').defaultNow(),
  replies: jsonb('replies').$type<Array<{ sender: 'client' | 'support'; message: string; createdAt: string }>>().default([]).notNull(),
});

// Relations definitions
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(clientProjects),
  tickets: many(clientTickets),
}));

export const clientProjectsRelations = relations(clientProjects, ({ one }) => ({
  client: one(users, {
    fields: [clientProjects.clientId],
    references: [users.uid],
  }),
}));

export const clientTicketsRelations = relations(clientTickets, ({ one }) => ({
  client: one(users, {
    fields: [clientTickets.clientId],
    references: [users.uid],
  }),
}));
