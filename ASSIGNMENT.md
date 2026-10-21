# Assignment: Jobs Board

Build a **Jobs Board** page at `/jobs` that lists openings from `GET /api/jobs`.

Read `README.md` (API reference) and `AGENTS.md` (conventions) first. Use whatever tools you normally use, AI included, and talk us through what you're doing and why.

## Requirements

1. **List.** Each job shows its title, company, location (or "Remote"), work mode, seniority, salary range when present, and how long ago it was posted. The title links to `job.url` in a new tab.
2. **Filters.**
   - Free-text search (`q`)
   - Job type (multi-select)
   - Remote only (`work_mode=remote`)
3. **Sort.** Newest (default), oldest, highest salary.
4. **Pagination.** Use the API's cursor. Either "Load more" or infinite scroll is fine.
5. **Shareable state.** Filters and sort live in the URL: refreshing or sharing the link restores the same view.
6. **States.** Loading, empty ("no jobs match") and error with retry. Try `FAILURE_RATE=0.3 bun run dev` to see failures.
7. **Navigation.** Add "Jobs" to the header.
8. **Tests.** Unit-test the pure logic you write (e.g. URL search → API params, salary formatting).

`bun run typecheck && bun run lint && bun test` must pass.

## If you have time

- Show the total result count.
- A "Clear filters" action.
- Seniority filter.
- Keep the previous results on screen while a new filter loads.
- Accessibility pass: keyboard use, labels, announcing result changes.

There's no single right answer. We care more about your decisions, and how you reached them, than about finishing everything.
