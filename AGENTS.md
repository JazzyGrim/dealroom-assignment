# Agent / contributor guide

Conventions for this repo. Follow them for any change.

## Layout

- `packages/contracts/` is the single source of truth for API shapes. **Never hand-write API types** in the web app; import them from `@jobs/contracts`.
- `apps/api/` must not be imported by `apps/web/` (and vice versa).

## Web app (`apps/web/`)

### Architecture: organised by feature

```text
src/
├── features/<name>/      # One folder per business domain
│   ├── index.ts          # Barrel: the ONLY entry point for code outside the feature
│   ├── keys.ts           # TanStack Query key factory
│   ├── api/              # Axios wrapper functions
│   ├── components/       # React components (PascalCase.tsx)
│   ├── hooks/            # `xxxQueryOptions` + `useXxx` query hooks, state hooks (camelCase.ts)
│   └── lib/              # Pure functions, no JSX
├── routes/               # File-based routes (TanStack Router). Keep them thin.
├── shared/               # Generic: api client, ui primitives, hooks, lib, config
└── integrations/         # Third-party setup (query client)
```

Create only the subfolders you need.

### Imports

- `#/` resolves to `src/`. Use it across folders; use relative paths inside a feature.
- Outside a feature, import from its barrel (`#/features/jobs`), never deep paths.
- `shared/` must not import from `features/`.

### Data fetching

- All HTTP goes through `apiClient` (`#/shared/api/client`). It serialises array params as comma-separated and rejects with `ApiError`.
- Each feature has a key factory:

  ```ts
  export const ThingKeys = {
    all: ['things'] as const,
    list: (params: ThingParams) => [...ThingKeys.all, 'list', params] as const,
  };
  ```

- Query hooks export the options factory and the hook, so loaders and components share one key:

  ```ts
  export const thingsQueryOptions = (params: ThingParams) =>
    queryOptions({ queryKey: ThingKeys.list(params), queryFn: () => fetchThings(params) });

  export const useThings = (params: ThingParams) => useQuery(thingsQueryOptions(params));
  ```

- Route loaders warm the cache with `queryClient.ensureQueryData(xxxQueryOptions(...))` (available on the router `context`).

### URL state

Filters, sorting and pagination that a user would want to share or keep on refresh live in the URL search params, validated with `validateSearch` (Zod). Derive API params from search with a pure function in the feature's `lib/` and unit-test it.

### UI

- Use the primitives in `#/shared/ui` (`Button`, `Badge`, `Card`, `Input`, `Select`, `Checkbox`, `Skeleton`, `Spinner`, `EmptyState`, `ErrorState`). Read a component before using it.
- Use the design tokens from `src/styles.css` (`bg-surface`, `text-muted`, `border-border`, `text-brand`…), not raw Tailwind palette colours.
- Every data view handles loading, empty and error states.
- Icons: `lucide-react`.

### Code style

- TypeScript strict, no `any`, named exports.
- Comments explain *why*, never *what*.
- Tests use the Bun test runner and live in `apps/<app>/tests/`, mirroring `src/`.

## Before you finish

```bash
bun run typecheck && bun run lint && bun test
```
