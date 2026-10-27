import { useMainStore } from '@/modules/main/store';
import format from '@/services/format';
import { Skeleton } from '@/ui/components/skeleton';
import styles from './index.module.css';

export function UserMenu() {
  const { data: user, status } = useMainStore((state) => state.user);

  if (!user) return status === 'error' ? null : <UserMenuSkeleton />;

  return (
    <div className={styles.root}>
      <div className={styles.balance} title="Current balance">
        💳 {format.money(user.balance)} <span className={styles.topUp}>Top up →</span>
      </div>
      <div className={styles.user}>
        <div className={styles.avatar} style={{ background: user.avatarColor }}>
          {user.initials}
        </div>
        <div className={styles.name}>{user.name}</div>
      </div>
    </div>
  );
}

export function UserMenuSkeleton() {
  return (
    <div className={styles.root} aria-busy="true">
      <Skeleton width={150} height={28} radius={999} />
      <div className={styles.user}>
        <Skeleton width={28} height={28} radius={14} />
        <Skeleton width={90} height={14} />
      </div>
    </div>
  );
}
