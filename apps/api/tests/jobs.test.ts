import { describe, expect, test } from 'bun:test';
import type { JobsListResponse } from '@jobs/contracts';
import { createApp } from '../src/app';

const app = createApp();
const get = async (qs = '') => {
  const res = await app.request(`/api/jobs${qs}`);
  return { status: res.status, body: (await res.json()) as JobsListResponse };
};

describe('GET /api/jobs', () => {
  test('returns the first page newest-first with a cursor', async () => {
    const { status, body } = await get();
    expect(status).toBe(200);
    expect(body.data).toHaveLength(20);
    expect(body.page.next_cursor).toBeString();
    expect(body.page.total).toBeNull();
    const dates = body.data.map((j) => j.posted_at);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  test('walks every page without duplicates', async () => {
    const seen = new Set<number>();
    let cursor: string | null = null;
    do {
      const { body }: { body: JobsListResponse } = await get(`?limit=50${cursor ? `&cursor=${cursor}` : ''}`);
      body.data.forEach((j) => seen.add(j.id));
      cursor = body.page.next_cursor;
    } while (cursor);
    const { body } = await get('?include_total=true');
    expect(seen.size).toBe(body.page.total!);
  });

  test('filters by comma-separated job types and search text', async () => {
    const { body } = await get('?job_type=design,data&q=senior&limit=100');
    expect(body.data.length).toBeGreaterThan(0);
    for (const job of body.data) {
      expect(['design', 'data']).toContain(job.job_type);
      expect(job.title.toLowerCase()).toContain('senior');
    }
  });

  test('rejects invalid params and cursors', async () => {
    expect((await get('?job_type=astronaut')).status).toBe(400);
    expect((await get('?cursor=nope')).status).toBe(400);
  });

  test('?fault forces an error response', async () => {
    expect((await app.request('/api/jobs?fault=503')).status).toBe(503);
  });
});
