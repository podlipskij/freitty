import { Link, useLocation } from 'react-router';
import { Button } from '@/ui/components/button';
import { Logo } from '@/ui/components/logo';
import { cx } from '@/ui/utils';
import { AttentionBadge } from './attention-badge';
import { NAV_ITEMS } from './constant';
import styles from './index.module.css';
import { NavItemContent } from './nav-item-content';

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className={styles.sidebar}>
      <Logo href="/dashboard" tone="light" className={styles.logo} />

      <nav>
        <ul className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const active = (item.matches ?? [item.href]).some((prefix) => pathname.startsWith(prefix));
            const content = (
              <NavItemContent icon={item.icon} label={item.label} badge={item.withBadge && <AttentionBadge />} />
            );

            return (
              <li key={item.href}>
                {item.disabled ? (
                  <span className={cx(styles.item, styles.disabled)} title="Coming soon">
                    {content}
                  </span>
                ) : (
                  <Link to={item.href} className={cx(styles.item, active && styles.active)}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.cta}>
        <Button variant="primary" disabled title="Order creation is out of scope" className={styles.ctaButton}>
          + New Order
        </Button>
      </div>
    </aside>
  );
}
