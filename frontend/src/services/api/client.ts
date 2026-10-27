import qs from 'qs';
import { config } from '@/config';

const DEFAULT_TIMEOUT = 10_000;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  query?: object;
  body?: unknown;
  abortSignal?: AbortSignal;
  timeout?: number;
  headers?: Record<string, string>;
  authRedirect?: boolean;
}

let unauthorizedHandler: (() => void) | null = null;

export function onUnauthorized(handler: () => void) {
  unauthorizedHandler = handler;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);

    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

async function errorMessage(response: Response, fallback: string): Promise<string> {
  const payload = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
  const message = Array.isArray(payload?.message) ? payload.message.join(', ') : payload?.message;
  return message || fallback;
}

export async function makeRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body, abortSignal, timeout = DEFAULT_TIMEOUT, headers, authRedirect = true } = options;

  if (config.isDevelopment) await sleep(Math.random() * 1000, abortSignal);

  const timeoutSignal = AbortSignal.timeout(timeout);
  const signal = abortSignal ? AbortSignal.any([abortSignal, timeoutSignal]) : timeoutSignal;
  const isJson = body !== undefined && !(body instanceof FormData);
  const url = `${config.apiUrl}${path}${qs.stringify(query, { addQueryPrefix: true, skipNulls: true })}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal,
      credentials: 'include',
      headers: {
        ...(isJson && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: isJson ? JSON.stringify(body) : (body as BodyInit | undefined),
    });
  } catch (error) {
    if (timeoutSignal.aborted) throw new ApiError(408, `${method} ${path} timed out after ${timeout}ms`);
    throw error;
  }

  if (response.status === 401 && authRedirect) unauthorizedHandler?.();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      await errorMessage(response, `${method} ${path} failed with ${response.status}`),
    );
  }
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}
