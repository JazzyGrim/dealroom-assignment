import axios from 'axios';
import { toApiError } from './errors';

/**
 * The one HTTP client. Relative `/api/*` URLs are proxied to the API by Vite in dev.
 * Errors are normalised to `ApiError`.
 */
export const apiClient = axios.create({
  baseURL: '/',
  timeout: 10_000,
  // `job_type: ['design', 'data']` → `job_type=design,data`, the format the API expects.
  paramsSerializer: {
    serialize: (params: Record<string, unknown>) => {
      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') continue;
        if (Array.isArray(value)) {
          if (value.length) search.set(key, value.join(','));
        } else {
          search.set(key, String(value));
        }
      }
      return search.toString();
    },
  },
});

apiClient.interceptors.response.use(undefined, (error: unknown) => Promise.reject(toApiError(error)));
