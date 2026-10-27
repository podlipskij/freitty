import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '@/services/api';
import { ApiError } from '@/services/api/client';
import { Button } from '@/ui/components/button';
import { TextField } from '@/ui/components/text-field';
import { DEMO_ACCOUNT } from '../../constant';
import { safeRedirect } from '../../utils';
import styles from './index.module.css';

interface LoginFormProps {
  next?: string;
}

export function LoginForm({ next }: LoginFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      await api.auth.login({ email, password });
      navigate(safeRedirect(next), { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? 'Invalid email or password'
          : 'Could not sign in, try again later',
      );
      setPending(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <TextField
        label="Email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoFocus
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" disabled={pending || !email || !password} className={styles.submit}>
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>

      <div className={styles.demo}>
        Demo access: <code>{DEMO_ACCOUNT.email}</code> / <code>{DEMO_ACCOUNT.password}</code>
        <br />
        (user2–user4@rway.test are dispatchers)
      </div>
    </form>
  );
}
