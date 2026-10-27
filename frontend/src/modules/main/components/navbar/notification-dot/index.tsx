import { useMainStore } from '@/modules/main/store';
import styles from './index.module.css';

export function NotificationDot() {
  const total = useMainStore((state) => state.attention.data?.total ?? 0);
  return total > 0 ? <span className={styles.dot} /> : null;
}
