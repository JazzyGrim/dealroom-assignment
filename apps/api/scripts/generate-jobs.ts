/**
 * Regenerates `src/data/jobs.json`. Seeded, so the output is stable across runs:
 *   bun run scripts/generate-jobs.ts
 */
import { JOB_TYPES, JobSchema, SENIORITIES, WORK_MODES, type Job, type JobType } from '@jobs/contracts';

let seed = 42;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32);
const pick = <T>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)]!;
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

const COMPANIES = [
  ['Northwind Robotics', 'northwind.ai'], ['Lumen Grid', 'lumengrid.energy'], ['Parcel Pilot', 'parcelpilot.io'],
  ['Fernwood Health', 'fernwood.health'], ['Quanta Ledger', 'quantaledger.com'], ['Brightloom', 'brightloom.co'],
  ['Hexa Mobility', 'hexamobility.eu'], ['Orbital Foods', 'orbitalfoods.com'], ['Tidepool Climate', 'tidepool.earth'],
  ['Cobalt Security', 'cobaltsec.io'], ['Meadow Labs', null], ['Kestrel Analytics', 'kestrel.dev'],
  ['Vela Payments', 'velapay.com'], ['Saltmarsh Bio', 'saltmarsh.bio'], ['Atlas Freight', 'atlasfreight.co'],
  ['Pinecone Learning', null], ['Halcyon Space', 'halcyon.space'], ['Juniper Legal', 'juniper.law'],
] as const;

const LOCATIONS = [
  ['Amsterdam', 'Netherlands'], ['Rotterdam', 'Netherlands'], ['Berlin', 'Germany'], ['Munich', 'Germany'],
  ['London', 'United Kingdom'], ['Manchester', 'United Kingdom'], ['Paris', 'France'], ['Lisbon', 'Portugal'],
  ['Zagreb', 'Croatia'], ['Barcelona', 'Spain'], ['Stockholm', 'Sweden'], ['Pittsburgh', 'United States'],
] as const;

const TITLES: Record<JobType, string[]> = {
  engineering: ['Frontend Engineer', 'Backend Engineer', 'Full-Stack Engineer', 'Platform Engineer', 'Mobile Engineer', 'Site Reliability Engineer', 'Embedded Software Engineer'],
  design: ['Product Designer', 'UX Researcher', 'Brand Designer', 'Design Systems Designer'],
  product: ['Product Manager', 'Technical Product Manager', 'Product Owner, Payments'],
  data: ['Data Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Analytics Engineer'],
  operations: ['Operations Manager', 'People Partner', 'Finance Lead', 'Office Manager'],
  sales: ['Account Executive', 'Sales Development Rep', 'Solutions Engineer', 'Partnerships Manager'],
  marketing: ['Growth Marketer', 'Content Lead', 'Product Marketing Manager'],
};

const TAGS: Record<JobType, string[]> = {
  engineering: ['TypeScript', 'React', 'Go', 'Rust', 'Kubernetes', 'PostgreSQL', 'AWS', 'GraphQL', 'Python'],
  design: ['Figma', 'Prototyping', 'User research', 'Design systems', 'Accessibility'],
  product: ['Roadmapping', 'B2B SaaS', 'Analytics', 'Discovery'],
  data: ['Python', 'SQL', 'dbt', 'BigQuery', 'PyTorch', 'Airflow'],
  operations: ['Hiring', 'Finance', 'Process', 'Compliance'],
  sales: ['Enterprise', 'SaaS', 'Salesforce', 'Negotiation'],
  marketing: ['SEO', 'Content', 'Paid acquisition', 'Lifecycle'],
};

const SENIORITY_PREFIX = { junior: 'Junior ', mid: '', senior: 'Senior ', lead: 'Lead ', principal: 'Principal ' } as const;
const SALARY_BASE = { junior: 38_000, mid: 55_000, senior: 75_000, lead: 90_000, principal: 110_000 } as const;
const CURRENCY: Record<string, 'EUR' | 'GBP' | 'USD'> = { 'United Kingdom': 'GBP', 'United States': 'USD' };
const NOW = Date.parse('2026-10-20T09:00:00Z');

const jobs: Job[] = Array.from({ length: 240 }, (_, i) => {
  const [companyName, domain] = pick(COMPANIES);
  const jobType = pick(JOB_TYPES);
  const seniority = pick(SENIORITIES);
  const workMode = pick(WORK_MODES);
  const [city, country] = pick(LOCATIONS);
  const base = SALARY_BASE[seniority] * (country === 'United States' ? 1.6 : 1);
  const min = Math.round((base + int(-5, 15) * 1000) / 1000) * 1000;
  const tags = [...new Set(Array.from({ length: int(1, 4) }, () => pick(TAGS[jobType])))];
  const slug = companyName.toLowerCase().replaceAll(' ', '-');
  const id = 100_000 + i * 7;
  return {
    id,
    title: SENIORITY_PREFIX[seniority] + pick(TITLES[jobType]),
    company: {
      id: slug,
      name: companyName,
      domain,
      logo_url: domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : null,
    },
    job_type: jobType,
    seniority,
    work_mode: workMode,
    location: { city: workMode === 'remote' && rand() < 0.5 ? null : city, country },
    salary: rand() < 0.25 ? null : { min, max: min + int(10, 30) * 1000, currency: CURRENCY[country] ?? 'EUR' },
    tags,
    posted_at: new Date(NOW - int(0, 60 * 24 * 60) * 60_000).toISOString(),
    url: `https://jobs.example.com/${slug}/${id}`,
  };
});

jobs.forEach((j) => JobSchema.parse(j));
await Bun.write(new URL('../src/data/jobs.json', import.meta.url), JSON.stringify(jobs, null, 2) + '\n');
console.log(`Wrote ${jobs.length} jobs`);
