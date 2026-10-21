import type { Job, JobSort, JobsListResponse, JobsQuery } from '@jobs/contracts';
import { decodeCursor, encodeCursor } from './cursor';

export class InvalidCursorError extends Error {}

const COMPARATORS: Record<JobSort, (a: Job, b: Job) => number> = {
  '-posted_at': (a, b) => b.posted_at.localeCompare(a.posted_at),
  posted_at: (a, b) => a.posted_at.localeCompare(b.posted_at),
  '-salary_max': (a, b) => (b.salary?.max ?? -1) - (a.salary?.max ?? -1),
  company_name: (a, b) => a.company.name.localeCompare(b.company.name),
};

function matches(job: Job, query: JobsQuery): boolean {
  if (query.job_type?.length && !query.job_type.includes(job.job_type)) return false;
  if (query.seniority?.length && !query.seniority.includes(job.seniority)) return false;
  if (query.work_mode?.length && !query.work_mode.includes(job.work_mode)) return false;
  if (query.country && job.location.country.toLowerCase() !== query.country.toLowerCase()) return false;
  if (query.q) {
    const needle = query.q.toLowerCase();
    const haystack = [job.title, job.company.name, ...job.tags].join(' ').toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function queryJobs(jobs: readonly Job[], query: JobsQuery): JobsListResponse {
  const offset = query.cursor === undefined ? 0 : decodeCursor(query.cursor);
  if (offset === null) throw new InvalidCursorError('Malformed cursor');

  const compare = COMPARATORS[query.sort];
  const filtered = jobs.filter((j) => matches(j, query)).sort((a, b) => compare(a, b) || b.id - a.id);
  const data = filtered.slice(offset, offset + query.limit);
  const nextOffset = offset + data.length;

  return {
    data,
    page: {
      limit: query.limit,
      next_cursor: nextOffset < filtered.length ? encodeCursor(nextOffset) : null,
      total: query.include_total ? filtered.length : null,
    },
  };
}
