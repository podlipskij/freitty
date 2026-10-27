import { Link } from 'react-router';
import { EmptyState } from '@/ui/components/empty-state';
import styles from './index.module.css';

export function NotFound() {
  return (
    <div className={styles.root}>
      <title>Not found · Freitty</title>
      <EmptyState icon="🔍" title="Nothing here">
        The page or order you are looking for does not exist. <Link to="/orders">Back to orders →</Link>
      </EmptyState>
    </div>
  );
}
