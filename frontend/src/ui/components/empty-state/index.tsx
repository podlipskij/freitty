import { ReactNode } from 'react';
import styles from './index.module.css';

interface EmptyStateProps {
  icon?: string;
  title: string;
  children?: ReactNode;
}

export function EmptyState({ icon = '📭', title, children }: EmptyStateProps) {
  return (
    <div className={styles.root}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.title}>{title}</div>
      {children && <div className={styles.text}>{children}</div>}
    </div>
  );
}
