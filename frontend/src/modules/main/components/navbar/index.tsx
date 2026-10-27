import { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import styles from './index.module.css';
import { LogoutButton } from './logout-button';
import { NotificationDot } from './notification-dot';
import { UserMenu } from './user-menu';

export function Navbar() {
  const navigate = useNavigate();

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('search')?.toString().trim();
    navigate(query ? `/orders?${new URLSearchParams({ search: query })}` : '/orders');
  };

  return (
    <header className={styles.topbar}>
      <form className={styles.search} role="search" onSubmit={search}>
        <span aria-hidden>🔍</span>
        <input name="search" placeholder="Search orders, refs, destinations…" aria-label="Search orders" />
      </form>

      <div className={styles.spacer} />

      <button type="button" className={styles.iconButton} aria-label="Notifications">
        🔔
        <NotificationDot />
      </button>
      <button type="button" className={styles.iconButton} aria-label="Help">
        ❓
      </button>
      <UserMenu />
      <LogoutButton />
    </header>
  );
}
