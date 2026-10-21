import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { createApp } from './app';

const port = Number(process.env.PORT ?? 3000);
const app = createApp({
  latencyMs: Number(process.env.LATENCY_MS ?? 400),
  failureRate: Number(process.env.FAILURE_RATE ?? 0),
});

const server = new Hono().use('*', logger()).route('/', app);

Bun.serve({ port, fetch: server.fetch });
console.log(`API listening on http://localhost:${port}`);
