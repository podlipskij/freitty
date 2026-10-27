import { cx } from '@/ui/utils';
import { UserShort } from '../../types';
import styles from './index.module.css';

interface UserChipProps {
  user: UserShort;
  variant?: 'inline' | 'pill';
}

export function UserChip({ user, variant = 'inline' }: UserChipProps) {
  return (
    <span className={cx(styles.root, styles[variant])}>
      <span className={styles.by}>by</span>
      <span className={styles.chip}>
        <span className={styles.avatar} style={{ background: user.avatarColor }}>
          {user.initials}
        </span>
        {user.name}
      </span>
      <span className={cx(styles.role, user.role === 'dispatcher' && styles.dispatcher)}>
        {user.role === 'admin' ? 'Admin' : 'Dispatcher'}
      </span>
    </span>
  );
}
