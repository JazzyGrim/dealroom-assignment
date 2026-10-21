import { JobSchema, type Job } from '@jobs/contracts';
import raw from './jobs.json';

export const JOBS: readonly Job[] = JobSchema.array().parse(raw);
