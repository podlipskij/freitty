import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMainStore } from '@/modules/main/store';
import api from '@/services/api';
import { LOGIN_PATH } from '@/services/api/constant';
import styles from './index.module.css';

export function LogoutButton() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const reset = useMainStore((state) => state.reset);

  const logout = async () => {
    setPending(true);
    try {
      await api.auth.logout();
    } finally {
      reset();
      navigate(LOGIN_PATH, { replace: true });
    }
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={logout}
      disabled={pending}
      aria-label="Sign out"
      title="Sign out"
    >
      ⎋
    </button>
  );
}
