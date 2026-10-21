import { QueryClient } from '@tanstack/react-query';
import { isApiError } from '#/shared/api/errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Client errors won't succeed on retry; only retry 5xx / network failures.
      retry: (failureCount, error) => failureCount < 2 && !(isApiError(error) && error.status < 500),
    },
  },
});
