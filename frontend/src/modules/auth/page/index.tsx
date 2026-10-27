import { useSearchParams } from 'react-router';
import { Logo } from '@/ui/components/logo';
import { LoginForm } from '../components/login-form';
import styles from './index.module.css';

export function LoginPage() {
  const [searchParams] = useSearchParams();

  return (
    <div className={styles.page}>
      <title>Sign in · Freitty</title>
      <div className={styles.card}>
        <Logo size="lg" className={styles.logo} />
        <h1 className={styles.title}>Sign in to Client Cabinet</h1>
        <p className={styles.subtitle}>Track your cross-dock and consolidation orders.</p>
        <LoginForm next={searchParams.get('next') ?? undefined} />
      </div>
    </div>
  );
}
