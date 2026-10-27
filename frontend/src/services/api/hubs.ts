import type { Hub } from '@/modules/order';
import { makeRequest } from './client';

const hubs = {
  getAll: (abortSignal?: AbortSignal) => makeRequest<Hub[]>('/hubs', { abortSignal }),
};

export default hubs;
