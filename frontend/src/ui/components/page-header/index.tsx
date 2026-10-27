import { ReactNode } from 'react';
import styles from './index.module.css';

interface PageHeaderProps {
  crumbs: string[];
  title: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ crumbs, title, actions }: PageHeaderProps) {
  return (
    <div className={styles.root}>
      <div className={styles.crumbs}>
        {crumbs.map((crumb, index) => (
          <span key={crumb}>
            {index > 0 && <span className={styles.separator}>›</span>}
            {crumb}
          </span>
        ))}
      </div>
      <div className={styles.titleRow}>
        <h1>{title}</h1>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}
