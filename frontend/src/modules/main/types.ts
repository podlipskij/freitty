import type { NeedAttention } from '@/modules/dashboard';
import type { SessionUser } from '@/modules/user';
import { Resource } from '@/services/resource';

export interface MainState {
  user: Resource<SessionUser>;
  attention: Resource<NeedAttention>;
}

export interface MainActions {
  loadUser: () => () => void;
  loadAttention: () => () => void;
  reset: () => void;
}

export type MainStore = MainState & MainActions;
