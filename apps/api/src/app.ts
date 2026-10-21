import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { JobsQuerySchema, type ApiError } from '@jobs/contracts';
import { JOBS } from './data/jobs';
import { InvalidCursorError, queryJobs } from './lib/queryJobs';

export interface AppOptions {
  /** Artificial delay per request, so loading states are visible locally. */
  latencyMs?: number;
  /** Share of requests (0–1) that fail with a 503, to exercise error handling. */
  failureRate?: number;
}

const apiError = (code: string, message: string): ApiError => ({ error: { code, message } });

export function createApp({ latencyMs = 0, failureRate = 0 }: AppOptions = {}) {
  const app = new Hono();

  app.use('/api/*', cors());

  app.use('/api/*', async (c, next) => {
    if (latencyMs > 0) await Bun.sleep(latencyMs);
    // `?fault=<status>` forces a failure on demand, e.g. /api/jobs?fault=500
    const fault = Number(c.req.query('fault'));
    if (fault >= 400 && fault < 600) {
      return c.json(apiError('injected_fault', `Injected ${fault}`), fault as 500);
    }
    if (Math.random() < failureRate) {
      return c.json(apiError('unavailable', 'Service temporarily unavailable'), 503);
    }
    await next();
  });

  app.get('/api/jobs', (c) => {
    const parsed = JobsQuerySchema.safeParse(c.req.query());
    if (!parsed.success) {
      return c.json(apiError('invalid_query', parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')), 400);
    }
    try {
      return c.json(queryJobs(JOBS, parsed.data));
    } catch (err) {
      if (err instanceof InvalidCursorError) return c.json(apiError('invalid_cursor', err.message), 400);
      throw err;
    }
  });

  app.notFound((c) => c.json(apiError('not_found', `No route for ${c.req.method} ${c.req.path}`), 404));
  app.onError((err, c) => {
    console.error(err);
    return c.json(apiError('internal', 'Internal server error'), 500);
  });

  return app;
}
