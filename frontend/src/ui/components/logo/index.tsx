import { Link } from 'react-router';
import { cx } from '@/ui/utils';
import styles from './index.module.css';

interface LogoProps {
  href?: string;
  tone?: 'light' | 'dark';
  size?: 'md' | 'lg';
  className?: string;
}

export function Logo({ href, tone = 'dark', size = 'md', className }: LogoProps) {
  const classes = cx(styles.logo, styles[tone], styles[size], className);
  const content = (
    <>
      FREITT<span className={styles.accent}>Y</span>
    </>
  );

  return href ? (
    <Link to={href} className={classes}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}
