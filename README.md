# Jobs Board

A small monorepo: a mock jobs API and a React app that consumes it.

```text
apps/api/            Hono API on Bun, serving GET /api/jobs from mock JSON
apps/web/            React 19 + Vite + TanStack Router + TanStack Query + Tailwind 4
packages/contracts/  Zod schemas and types shared by the API and the web app
```

## Setup

Requires [Bun](https://bun.sh) 1.4+ (`mise install` picks up the pinned version).

```bash
bun install      # once, at the repo root
bun run dev      # API on :3000, web on http://localhost:3001 (proxies /api → :3000)
```

| Command             | What it does                    |
| ------------------- | ------------------------------- |
| `bun run dev`       | Start API and web app           |
| `bun test`          | Run all tests (Bun test runner) |
| `bun run typecheck` | Type-check every workspace      |
| `bun run lint`      | ESLint the web app              |

## The API

`GET /api/jobs` returns a page of job openings. All params are optional.

| Param           | Example                 | Notes                                                      |
| --------------- | ----------------------- | ---------------------------------------------------------- |
| `q`             | `react`                 | Case-insensitive match on title, company name and tags     |
| `job_type`      | `engineering,design`    | Comma-separated, any of `JOB_TYPES`                        |
| `seniority`     | `senior,lead`           | Comma-separated, any of `SENIORITIES`                      |
| `work_mode`     | `remote`                | Comma-separated: `onsite`, `hybrid`, `remote`              |
| `country`       | `Germany`               | Exact country name, case-insensitive                       |
| `sort`          | `-posted_at`            | `-posted_at` (default), `posted_at`, `-salary_max`, `company_name` |
| `limit`         | `20`                    | 1–100, default 20                                          |
| `cursor`        | `eyJvIjoyMH0`           | Opaque; pass back `page.next_cursor` as-is                 |
| `include_total` | `true`                  | Compute `page.total` (otherwise `null`)                    |

```json
{
  "data": [{ "id": 101344, "title": "UX Researcher", "company": { "id": "lumen-grid", "name": "Lumen Grid", "...": "..." }, "...": "..." }],
  "page": { "limit": 20, "next_cursor": "eyJvIjoyMH0", "total": null }
}
```

Errors use one envelope: `{ "error": { "code": "invalid_query", "message": "..." } }` (400 for bad params or cursor).

The full shapes are in `packages/contracts/src/jobs.ts`.

### Simulating a real network

- Every request is delayed by `LATENCY_MS` (default `400`).
- `FAILURE_RATE=0.2 bun run dev` fails 20% of requests with a 503.
- `?fault=500` (or any 4xx/5xx) on a request forces that status.
