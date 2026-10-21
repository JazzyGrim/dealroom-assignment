import { isAxiosError } from 'axios';
import { ApiErrorSchema } from '@jobs/contracts';

/** Every failed request through `apiClient` rejects with this. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  if (isAxiosError(error)) {
    if (!error.response) return new ApiError(0, 'network_error', 'Could not reach the server');
    const body = ApiErrorSchema.safeParse(error.response.data);
    return body.success
      ? new ApiError(error.response.status, body.data.error.code, body.data.error.message)
      : new ApiError(error.response.status, 'unknown', error.message);
  }
  return new ApiError(0, 'unknown', error instanceof Error ? error.message : 'Unknown error');
}
