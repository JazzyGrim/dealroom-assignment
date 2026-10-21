import { describe, expect, test } from 'bun:test';
import { AxiosError, AxiosHeaders } from 'axios';
import { ApiError, toApiError } from '#/shared/api/errors';

const responseError = (status: number, data: unknown) =>
  new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status,
    data,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('toApiError', () => {
  test('reads the API error envelope', () => {
    const err = toApiError(responseError(400, { error: { code: 'invalid_query', message: 'bad sort' } }));
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 400, code: 'invalid_query', message: 'bad sort' });
  });

  test('maps a missing response to a network error', () => {
    expect(toApiError(new AxiosError('Network Error')).code).toBe('network_error');
  });
});
