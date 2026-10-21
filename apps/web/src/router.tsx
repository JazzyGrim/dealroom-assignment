import { createRouter } from '@tanstack/react-router';
import { queryClient } from './integrations/tanstack-query/queryClient';
import { routeTree } from './routeTree.gen';
import { NotFound } from './shared/ui/NotFound';
import { ErrorState } from './shared/ui/ErrorState';

export const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultNotFoundComponent: NotFound,
  defaultErrorComponent: ({ error, reset }) => <ErrorState error={error} onRetry={reset} />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
