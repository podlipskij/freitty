import { Button } from '@/ui/components/button';
import styles from './index.module.css';

interface LoadErrorProps {
  message?: string;
  onRetry: () => void;
}

export function LoadError({ message = 'Could not load data.', onRetry }: LoadErrorProps) {
  return (
    <div className={styles.root} role="alert">
      <span>⚠ {message}</span>
      <Button size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
