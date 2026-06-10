const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const COMPANY_LOGOS = {
  Google: 'https://logo.clearbit.com/google.com',
  Microsoft: 'https://logo.clearbit.com/microsoft.com',
  Amazon: 'https://logo.clearbit.com/amazon.com',
  Meta: 'https://logo.clearbit.com/meta.com',
  Netflix: 'https://logo.clearbit.com/netflix.com',
  Apple: 'https://logo.clearbit.com/apple.com',
  Airbnb: 'https://logo.clearbit.com/airbnb.com',
  Spotify: 'https://logo.clearbit.com/spotify.com',
  Stripe: 'https://logo.clearbit.com/stripe.com',
  Shopify: 'https://logo.clearbit.com/shopify.com',
  Uber: 'https://logo.clearbit.com/uber.com',
  Adobe: 'https://logo.clearbit.com/adobe.com',
  Tesla: 'https://logo.clearbit.com/tesla.com',
  Atlassian: 'https://logo.clearbit.com/atlassian.com',
  Figma: 'https://logo.clearbit.com/figma.com',
  Slack: 'https://logo.clearbit.com/slack.com',
  GitHub: 'https://logo.clearbit.com/github.com',
  Notion: 'https://logo.clearbit.com/notion.so',
  Vercel: 'https://logo.clearbit.com/vercel.com',
  OpenAI: 'https://logo.clearbit.com/openai.com',
};

export const JOB_TYPES = [
  'Full Time',
  'Part Time',
  'Remote',
  'Hybrid',
  'Internship',
  'Contract',
];

export const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Lead',
  'Executive',
];

const baseJobs = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full Time',
    experience: 'Senior Level',
    salaryMin: 160000,
    salaryMax: 220000,
    skills: ['React', 'TypeScript', 'GraphQL', 'CSS', 'Performance'],
    description:
      'Join the Google Search frontend team to build delightful, fast experiences used by billions every day.',
    responsibilities: [
      'Architect and build user-facing features in React and TypeScript',
      'Collaborate with designers, PMs and backend engineers',
      'Improve performance, accessibility and developer experience',
      'Mentor junior engineers and uphold engineering excellence',
    ],
    requirements: [
      '5+ years of professional frontend experience',
      'Expert in React, TypeScript, modern build tooling',
      'Strong CS fundamentals and product sense',
      'BS/MS in Computer Science or equivalent practical experience',
    ],
  },
  {
    title: 'Product Designer',
    company: 'Figma',
    location: 'Remote',
    type: 'Remote',
    experience: 'Mid Level',
    salaryMin: 110000,
    salaryMax: 150000,
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
    description:
      'Help design the future of collaborative tools at Figma. Own end-to-end product design.',
    responsibilities: [
      'Lead design from research to ship',
      'Build and contribute to design systems',
      'Run usability tests and synthesize insights',
      'Partner closely with engineering',
    ],
    requirements: [
      '3+ years of product design experience',
      'Strong portfolio across web and mobile',
      'Excellent communicator',
    ],
  },
  {
    title: 'Backend Engineer (Node.js)',
    company: 'Stripe',
    location: 'San Francisco, CA',
    type: 'Hybrid',
    experience: 'Mid Level',
    salaryMin: 145000,
    salaryMax: 195000,
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Distributed Systems'],
    description:
      'Build resilient APIs powering millions of transactions per minute at Stripe.',
    responsibilities: [
      'Design and ship scalable APIs',
      'Own service reliability and on-call',
      'Improve observability and tooling',
    ],
    requirements: [
      '3+ years backend engineering',
      'Hands-on with Node.js + relational databases',
      'Comfort with on-call and production systems',
    ],
  },
  {
    title: 'iOS Developer',
    company: 'Apple',
    location: 'Cupertino, CA',
    type: 'Full Time',
    experience: 'Senior Level',
    salaryMin: 170000,
    salaryMax: 240000,
    skills: ['Swift', 'SwiftUI', 'UIKit', 'Combine'],
    description:
      'Craft polished iOS experiences for hundreds of millions of devices worldwide.',
    responsibilities: [
      'Lead iOS feature development',
      'Champion code quality and reviews',
      'Work cross-functionally with design and PM',
    ],
    requirements: [
      '5+ years iOS development',
      'Expert in Swift / SwiftUI',
      'Shipped multiple consumer apps',
    ],
  },
  {
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'Hybrid',
    experience: 'Senior Level',
    salaryMin: 180000,
    salaryMax: 260000,
    skills: ['Python', 'SQL', 'ML', 'Experimentation', 'Statistics'],
    description:
      'Drive personalization decisions for the world\'s leading streaming platform.',
    responsibilities: [
      'Run product experiments end-to-end',
      'Build ML models for recommendations',
      'Translate data into product insights',
    ],
    requirements: [
      'PhD or MS in a quantitative field',
      '4+ years applied DS experience',
      'Strong Python + SQL',
    ],
  },
  {
    title: 'DevOps Engineer',
    company: 'Amazon',
    location: 'Seattle, WA',
    type: 'Full Time',
    experience: 'Mid Level',
    salaryMin: 130000,
    salaryMax: 180000,
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
    description: 'Scale infrastructure that powers Amazon retail at planet scale.',
    responsibilities: [
      'Own infra automation and IaC',
      'Improve CI/CD pipelines',
      'Drive cost & reliability improvements',
    ],
    requirements: [
      '3+ years DevOps / SRE',
      'Hands-on with AWS and Kubernetes',
      'Scripting in Python or Go',
    ],
  },
  {
    title: 'UX Researcher',
    company: 'Airbnb',
    location: 'Remote',
    type: 'Remote',
    experience: 'Mid Level',
    salaryMin: 120000,
    salaryMax: 160000,
    skills: ['User Research', 'Surveys', 'Interviews', 'Synthesis'],
    description:
      'Uncover insights that shape the next generation of travel experiences.',
    responsibilities: [
      'Plan and run mixed-methods studies',
      'Synthesize and share findings',
      'Influence product strategy',
    ],
    requirements: [
      '3+ years UX research',
      'Excellent storytelling',
    ],
  },
  {
    title: 'Marketing Manager',
    company: 'Spotify',
    location: 'New York, NY',
    type: 'Hybrid',
    experience: 'Mid Level',
    salaryMin: 95000,
    salaryMax: 135000,
    skills: ['Growth', 'Campaigns', 'Analytics', 'Branding'],
    description:
      'Lead growth campaigns that bring music to more listeners around the world.',
    responsibilities: [
      'Own quarterly growth campaigns',
      'Partner with content and design',
      'Analyze and report on performance',
    ],
    requirements: [
      '4+ years marketing',
      'Data-driven mindset',
    ],
  },
  {
    title: 'Full Stack Engineer',
    company: 'Shopify',
    location: 'Remote',
    type: 'Remote',
    experience: 'Mid Level',
    salaryMin: 120000,
    salaryMax: 170000,
    skills: ['React', 'Ruby on Rails', 'GraphQL', 'PostgreSQL'],
    description: 'Help millions of merchants succeed online.',
    responsibilities: [
      'Build features across the stack',
      'Ship continuously and own quality',
    ],
    requirements: [
      '3+ years full stack experience',
      'Comfort with React + Rails',
    ],
  },
  {
    title: 'Machine Learning Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    type: 'Full Time',
    experience: 'Senior Level',
    salaryMin: 220000,
    salaryMax: 320000,
    skills: ['PyTorch', 'CUDA', 'LLMs', 'Distributed Training'],
    description: 'Push the frontier of safe, beneficial AGI.',
    responsibilities: [
      'Train and align large models',
      'Build robust evaluation pipelines',
    ],
    requirements: [
      '4+ years ML engineering',
      'Deep PyTorch experience',
    ],
  },
  {
    title: 'Software Engineering Intern',
    company: 'Microsoft',
    location: 'Redmond, WA',
    type: 'Internship',
    experience: 'Entry Level',
    salaryMin: 8000,
    salaryMax: 12000,
    skills: ['C#', 'Azure', '.NET', 'Algorithms'],
    description:
      'A 12-week internship building real features in the Microsoft 365 suite.',
    responsibilities: [
      'Own a small project end-to-end',
      'Learn from senior engineers',
    ],
    requirements: [
      'Pursuing a CS degree',
      'Strong coding fundamentals',
    ],
  },
  {
    title: 'Engineering Manager',
    company: 'Atlassian',
    location: 'Sydney, AU',
    type: 'Hybrid',
    experience: 'Lead',
    salaryMin: 200000,
    salaryMax: 270000,
    skills: ['Leadership', 'Architecture', 'Mentorship', 'Agile'],
    description:
      'Lead a team building the future of team collaboration at Atlassian.',
    responsibilities: [
      'Grow and mentor engineers',
      'Drive technical strategy',
      'Partner with PM and design',
    ],
    requirements: [
      '2+ years management',
      '6+ years engineering',
    ],
  },
  {
    title: 'Cloud Solutions Architect',
    company: 'Adobe',
    location: 'San Jose, CA',
    type: 'Full Time',
    experience: 'Senior Level',
    salaryMin: 175000,
    salaryMax: 240000,
    skills: ['AWS', 'Azure', 'Architecture', 'Security'],
    description:
      'Architect cloud solutions that empower creative professionals worldwide.',
    responsibilities: [
      'Design multi-cloud architectures',
      'Advise enterprise customers',
    ],
    requirements: [
      '7+ years architecture experience',
      'Cloud certifications a plus',
    ],
  },
  {
    title: 'Customer Success Manager',
    company: 'Slack',
    location: 'Remote',
    type: 'Remote',
    experience: 'Mid Level',
    salaryMin: 90000,
    salaryMax: 130000,
    skills: ['Customer Success', 'SaaS', 'Communication'],
    description: 'Partner with customers to help them get the most out of Slack.',
    responsibilities: [
      'Own a portfolio of accounts',
      'Drive adoption and retention',
    ],
    requirements: [
      '3+ years CSM in SaaS',
    ],
  },
  {
    title: 'Mobile Developer (Android)',
    company: 'Uber',
    location: 'San Francisco, CA',
    type: 'Hybrid',
    experience: 'Mid Level',
    salaryMin: 140000,
    salaryMax: 195000,
    skills: ['Kotlin', 'Android', 'Jetpack Compose'],
    description: 'Help build the rider app used in 70+ countries.',
    responsibilities: [
      'Develop core rider features',
      'Improve app performance',
    ],
    requirements: [
      '3+ years Android development',
      'Strong Kotlin experience',
    ],
  },
  {
    title: 'Frontend Engineer (React)',
    company: 'Vercel',
    location: 'Remote',
    type: 'Remote',
    experience: 'Mid Level',
    salaryMin: 130000,
    salaryMax: 180000,
    skills: ['React', 'Next.js', 'TypeScript', 'Edge'],
    description:
      'Build the developer experience used by millions of frontend developers.',
    responsibilities: [
      'Ship features for the Vercel dashboard',
      'Improve performance and DX',
    ],
    requirements: [
      '3+ years React experience',
      'Strong TypeScript',
    ],
  },
  {
    title: 'Game Designer',
    company: 'Tesla',
    location: 'Palo Alto, CA',
    type: 'Full Time',
    experience: 'Mid Level',
    salaryMin: 110000,
    salaryMax: 155000,
    skills: ['Game Design', 'Unity', 'Storytelling'],
    description:
      'Design playful, in-vehicle experiences that delight Tesla drivers.',
    responsibilities: [
      'Prototype and ship new mini-games',
      'Collaborate with engineering and art',
    ],
    requirements: [
      '3+ years game design',
      'Shipped at least one title',
    ],
  },
  {
    title: 'QA Automation Engineer',
    company: 'GitHub',
    location: 'Remote',
    type: 'Remote',
    experience: 'Mid Level',
    salaryMin: 95000,
    salaryMax: 135000,
    skills: ['Playwright', 'Cypress', 'CI/CD'],
    description: 'Build automated test suites for the world\'s code platform.',
    responsibilities: [
      'Write and maintain end-to-end tests',
      'Improve flake-rate and runtime',
    ],
    requirements: [
      '3+ years QA automation',
    ],
  },
  {
    title: 'Technical Writer',
    company: 'Notion',
    location: 'Remote',
    type: 'Part Time',
    experience: 'Mid Level',
    salaryMin: 60000,
    salaryMax: 95000,
    skills: ['Writing', 'Docs', 'Markdown'],
    description: 'Create world-class developer and user documentation for Notion.',
    responsibilities: [
      'Author developer docs',
      'Maintain consistent voice across docs',
    ],
    requirements: [
      '2+ years technical writing',
    ],
  },
  {
    title: 'Security Engineer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    type: 'Full Time',
    experience: 'Senior Level',
    salaryMin: 180000,
    salaryMax: 260000,
    skills: ['Security', 'Pentesting', 'Cryptography', 'AppSec'],
    description: 'Keep billions of users safe across Meta\'s family of apps.',
    responsibilities: [
      'Lead application security reviews',
      'Build security tooling',
    ],
    requirements: [
      '5+ years security engineering',
      'Strong understanding of AppSec',
    ],
  },
];

const TRENDING_TITLES = new Set([
  'Senior Frontend Engineer',
  'Machine Learning Engineer',
  'Product Designer',
  'Full Stack Engineer',
  'DevOps Engineer',
]);

export const seedJobs = baseJobs.map((j, idx) => ({
  id: `seed-${idx + 1}`,
  ...j,
  logo: COMPANY_LOGOS[j.company],
  postedAt: daysAgo(Math.floor(Math.random() * 21)),
  trending: TRENDING_TITLES.has(j.title),
  postedBy: 'system',
}));

export const seedCompanies = Array.from(
  new Set(baseJobs.map((j) => j.company)),
).map((name) => ({
  name,
  logo: COMPANY_LOGOS[name],
  openings: baseJobs.filter((j) => j.company === name).length,
}));
