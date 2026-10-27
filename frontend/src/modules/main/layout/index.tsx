import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { Navbar } from '../components/navbar';
import { Sidebar } from '../components/sidebar';
import { useMainStore } from '../store';
import styles from './index.module.css';

export function MainLayout() {
  const loadUser = useMainStore((state) => state.loadUser);
  const loadAttention = useMainStore((state) => state.loadAttention);

  useEffect(() => loadUser(), [loadUser]);
  useEffect(() => loadAttention(), [loadAttention]);

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
