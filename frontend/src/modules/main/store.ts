import { create } from 'zustand';
import type { NeedAttention } from '@/modules/dashboard';
import type { SessionUser } from '@/modules/user';
import api from '@/services/api';
import { createLoader, idle } from '@/services/resource';
import { MainStore } from './types';

export const useMainStore = create<MainStore>()((set) => {
  const loadUser = createLoader<SessionUser>((user) => set({ user }));
  const loadAttention = createLoader<NeedAttention>((attention) => set({ attention }));

  return {
    user: idle(),
    attention: idle(),

    loadUser: () => loadUser((signal) => api.users.getMe(signal)),
    loadAttention: () => loadAttention((signal) => api.dashboard.getAttention(signal)),
    reset: () => set({ user: idle(), attention: idle() }),
  };
});
