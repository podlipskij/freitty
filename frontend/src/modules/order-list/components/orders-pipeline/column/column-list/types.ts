export interface ListContext {
  loading: boolean;
  failed: boolean;
  retry: () => void;
}
