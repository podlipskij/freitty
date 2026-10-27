import { useMainStore } from '@/modules/main/store';
import { Skeleton } from '@/ui/components/skeleton';
import styles from './index.module.css';

export function AttentionBadge() {
  const { data: attention, status } = useMainStore((state) => state.attention);

  if (!attention) {
    return status === 'error' ? null : <Skeleton width={20} height={16} radius={8} className={styles.loading} />;
  }
  if (attention.total === 0) return null;

  return <span className={styles.badge}>{attention.total}</span>;
}
