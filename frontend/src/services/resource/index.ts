import { ApiError } from '@/services/api/client';

export type ResourceStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface Resource<T> {
  data: T | null;
  status: ResourceStatus;
  errorCode: number | null;
}

export const idle = <T>(): Resource<T> => ({ data: null, status: 'idle', errorCode: null });

const loading = <T>(): Resource<T> => ({ data: null, status: 'loading', errorCode: null });

export function createLoader<T>(commit: (resource: Resource<T>) => void) {
  let controller: AbortController | null = null;

  return (request: (signal: AbortSignal) => Promise<T>): (() => void) => {
    controller?.abort();
    const current = new AbortController();
    controller = current;
    commit(loading());

    request(current.signal)
      .then((data) => !current.signal.aborted && commit({ data, status: 'ready', errorCode: null }))
      .catch((error: unknown) => {
        if (current.signal.aborted) return;
        const errorCode = error instanceof ApiError ? error.status : null;
        if (import.meta.env.DEV && (errorCode === null || errorCode >= 500)) console.error(error);
        commit({ data: null, status: 'error', errorCode });
      });

    return () => {
      controller?.abort();
      controller = null;
      commit(idle());
    };
  };
}
