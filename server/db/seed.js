import 'dotenv/config';
import { db, fromJson } from './index.js';

const COMPANY_LOGOS = {
  Google: 'https://logo.clearbit.com/google.com',
  Microsoft: 'https://logo.clearbit.com/microsoft.com',
  Amazon: 'https://logo.clearbit.com/amazon.com',
  Meta: 'https://logo.clearbit.com/meta.com',
  Netflix: 'https://logo.clearbit.com/netflix.com',
  Apple: 'https://logo.clearbit.com/apple.com',
  Stripe: 'https://logo.clearbit.com/stripe.com',
  Shopify: 'https://logo.clearbit.com/shopify.com',
  Adobe: 'https://logo.clearbit.com/adobe.com',
  Figma: 'https://logo.clearbit.com/figma.com',
  GitHub: 'https://logo.clearbit.com/github.com',
  Notion: 'https://logo.clearbit.com/notion.so',
  Vercel: 'https://logo.clearbit.com/vercel.com',
  OpenAI: 'https://logo.clearbit.com/openai.com',
};

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const SEED_JOBS = [
  {
    id: 'seed-1',
    title: 'Senior Frontend Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full Time',
    experience: 'Senior Level',
    salary_min: 160000,
    salary_max: 220000,
    skills: ['React', 'TypeScript', 'GraphQL', 'CSS'],
    description:
      'Join the Google Search frontend team to build delightful, fast experiences used by billions every day.',
    responsibilities: [
      'Architect and build user-facing features in React and TypeScript',
      'Collaborate with designers, PMs and backend engineers',
      'Improve performance, accessibility and developer experience',
    ],
    requirements: [
      '5+ years of professional frontend experience',
      'Expert in React, TypeScript, modern build tooling',
      'Strong CS fundamentals and product sense',
    ],
    trending: 1,
  },
  {
    id: 'seed-2',
    title: 'Backend Engineer (Node.js)',
    company: 'Stripe',
    location: 'San Francisco, CA',
    type: 'Hybrid',
    experience: 'Mid Level',
    salary_min: 145000,
    salary_max: 195000,
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    description: 'Build resilient APIs powering millions of transactions per minute at Stripe.',
    responsibilities: [
      'Design and ship scalable APIs',
      'Own service reliability and on-call',
    ],
    requirements: [
      '3+ years backend engineering',
      'Hands-on with Node.js + relational databases',
    ],
    trending: 0,
  },
  {
    id: 'seed-3',
    title: 'Product Designer',
    company: 'Figma',
    location: 'Remote',
    type: 'Remote',
    experience: 'Mid Level',
    salary_min: 110000,
    salary_max: 150000,
    skills: ['Figma', 'Prototyping', 'Design Systems'],
    description: 'Help design the future of collaborative tools at Figma.',
    responsibilities: ['Lead design from research to ship'],
    requirements: ['3+ years of product design experience'],
    trending: 1,
  },
  {
    id: 'seed-4',
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'Hybrid',
    experience: 'Senior Level',
    salary_min: 180000,
    salary_max: 260000,
    skills: ['Python', 'SQL', 'ML', 'Statistics'],
    description: "Drive personalization decisions for the world's leading streaming platform.",
    responsibilities: ['Run product experiments end-to-end'],
    requirements: ['PhD or MS in a quantitative field'],
    trending: 0,
  },
  {
    id: 'seed-5',
    title: 'DevOps Engineer',
    company: 'Amazon',
    location: 'Seattle, WA',
    type: 'Full Time',
    experience: 'Mid Level',
    salary_min: 130000,
    salary_max: 180000,
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    description: 'Scale infrastructure that powers Amazon retail at planet scale.',
    responsibilities: ['Own infra automation and IaC'],
    requirements: ['3+ years DevOps / SRE'],
    trending: 1,
  },
  {
    id: 'seed-6',
    title: 'iOS Developer',
    company: 'Apple',
    location: 'Cupertino, CA',
    type: 'Full Time',
    experience: 'Senior Level',
    salary_min: 170000,
    salary_max: 240000,
    skills: ['Swift', 'SwiftUI', 'UIKit'],
    description: 'Craft polished iOS experiences for hundreds of millions of devices.',
    responsibilities: ['Lead iOS feature development'],
    requirements: ['5+ years iOS development'],
    trending: 0,
  },
  {
    id: 'seed-7',
    title: 'Software Engineering Intern',
    company: 'Microsoft',
    location: 'Redmond, WA',
    type: 'Internship',
    experience: 'Entry Level',
    salary_min: 8000,
    salary_max: 12000,
    skills: ['C#', 'Azure', '.NET'],
    description: 'A 12-week internship building real features in the Microsoft 365 suite.',
    responsibilities: ['Own a small project end-to-end'],
    requirements: ['Pursuing a CS degree'],
    trending: 0,
  },
  {
    id: 'seed-8',
    title: 'Machine Learning Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    type: 'Full Time',
    experience: 'Senior Level',
    salary_min: 220000,
    salary_max: 320000,
    skills: ['PyTorch', 'CUDA', 'LLMs'],
    description: 'Push the frontier of safe, beneficial AGI.',
    responsibilities: ['Train and align large models'],
    requirements: ['4+ years ML engineering'],
    trending: 1,
  },
  {
    id: 'seed-9',
    title: 'Frontend Engineer (React)',
    company: 'Vercel',
    location: 'Remote',
    type: 'Remote',
    experience: 'Mid Level',
    salary_min: 130000,
    salary_max: 180000,
    skills: ['React', 'Next.js', 'TypeScript'],
    description: 'Build the developer experience used by millions.',
    responsibilities: ['Ship features for the Vercel dashboard'],
    requirements: ['3+ years React experience'],
    trending: 0,
  },
  {
    id: 'seed-10',
    title: 'Technical Writer',
    company: 'Notion',
    location: 'Remote',
    type: 'Part Time',
    experience: 'Mid Level',
    salary_min: 60000,
    salary_max: 95000,
    skills: ['Writing', 'Docs', 'Markdown'],
    description: 'Create world-class developer and user documentation for Notion.',
    responsibilities: ['Author developer docs'],
    requirements: ['2+ years technical writing'],
    trending: 0,
  },
];

const insertJob = db.prepare(`
  INSERT OR REPLACE INTO jobs (
    id, title, company, location, type, experience,
    salary_min, salary_max, description,
    responsibilities, requirements, skills,
    logo, trending, source, apply_url, is_real,
    posted_by, posted_at
  ) VALUES (
    @id, @title, @company, @location, @type, @experience,
    @salary_min, @salary_max, @description,
    @responsibilities, @requirements, @skills,
    @logo, @trending, @source, @apply_url, @is_real,
    @posted_by, @posted_at
  )
`);

const insertMany = db.transaction((rows) => {
  for (const r of rows) insertJob.run(r);
});

const rows = SEED_JOBS.map((j, i) => ({
  ...j,
  responsibilities: fromJson(j.responsibilities || []),
  requirements: fromJson(j.requirements || []),
  skills: fromJson(j.skills || []),
  logo: COMPANY_LOGOS[j.company] || null,
  source: 'seed',
  apply_url: null,
  is_real: 0,
  posted_by: null,
  posted_at: daysAgo(i),
}));

insertMany(rows);

console.log(`✅ Seeded ${rows.length} jobs into the database.`);
