import { z } from 'zod';

export const JOB_TYPES = ['engineering', 'design', 'product', 'data', 'operations', 'sales', 'marketing'] as const;
export const SENIORITIES = ['junior', 'mid', 'senior', 'lead', 'principal'] as const;
export const WORK_MODES = ['onsite', 'hybrid', 'remote'] as const;
export const JOB_SORTS = ['-posted_at', 'posted_at', '-salary_max', 'company_name'] as const;

export const JobTypeSchema = z.enum(JOB_TYPES);
export const SenioritySchema = z.enum(SENIORITIES);
export const WorkModeSchema = z.enum(WORK_MODES);
export const JobSortSchema = z.enum(JOB_SORTS);

export const CompanyRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  domain: z.string().nullable(),
  logo_url: z.string().nullable(),
});

export const SalarySchema = z.object({
  min: z.number().int(),
  max: z.number().int(),
  currency: z.enum(['EUR', 'GBP', 'USD']),
});

export const JobSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  company: CompanyRefSchema,
  job_type: JobTypeSchema,
  seniority: SenioritySchema,
  work_mode: WorkModeSchema,
  location: z.object({ city: z.string().nullable(), country: z.string() }),
  salary: SalarySchema.nullable(),
  tags: z.array(z.string()),
  posted_at: z.iso.datetime(),
  url: z.url(),
});

const csv = <T extends z.ZodType<unknown, string>>(item: T) =>
  z
    .string()
    .transform((s) => s.split(',').map((v) => v.trim()).filter(Boolean))
    .pipe(z.array(item));

/** Query string accepted by `GET /api/jobs`. Multi-value params are comma-separated. */
export const JobsQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  job_type: csv(JobTypeSchema).optional(),
  seniority: csv(SenioritySchema).optional(),
  work_mode: csv(WorkModeSchema).optional(),
  country: z.string().optional(),
  sort: JobSortSchema.default('-posted_at'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
  include_total: z.stringbool().default(false),
});

export const JobsListResponseSchema = z.object({
  data: z.array(JobSchema),
  page: z.object({
    limit: z.number().int(),
    next_cursor: z.string().nullable(),
    total: z.number().int().nullable(),
  }),
});

export const ApiErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});

export type JobType = z.infer<typeof JobTypeSchema>;
export type Seniority = z.infer<typeof SenioritySchema>;
export type WorkMode = z.infer<typeof WorkModeSchema>;
export type JobSort = z.infer<typeof JobSortSchema>;
export type CompanyRef = z.infer<typeof CompanyRefSchema>;
export type Job = z.infer<typeof JobSchema>;
/** Parsed query (what the server sees after validation). */
export type JobsQuery = z.output<typeof JobsQuerySchema>;
/** Raw query params a client sends. */
export type JobsQueryParams = z.input<typeof JobsQuerySchema>;
export type JobsListResponse = z.infer<typeof JobsListResponseSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
