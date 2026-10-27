import { ReactNode } from 'react';
import { cx } from '@/ui/utils';
import styles from './index.module.css';

interface PanelProps {
  title?: ReactNode;
  actions?: ReactNode;
  flush?: boolean;
  className?: string;
  children: ReactNode;
}

export function Panel({ title, actions, flush, className, children }: PanelProps) {
  return (
    <section className={cx(styles.panel, className)}>
      {(title || actions) && (
        <header className={styles.header}>
          <div className={styles.title}>{title}</div>
          {actions}
        </header>
      )}
      <div className={cx(!flush && styles.body)}>{children}</div>
    </section>
  );
}
