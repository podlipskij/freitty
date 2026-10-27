import { Link } from 'react-router';
import { ReactNode } from 'react';
import { cx } from '@/ui/utils';
import styles from './index.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'sm';
  type?: 'button' | 'submit';
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  href,
  disabled,
  onClick,
  title,
  className,
  children,
}: ButtonProps) {
  const classes = cx(styles.button, styles[variant], styles[size], className);

  if (href) {
    return (
      <Link className={classes} to={href} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} title={title}>
      {children}
    </button>
  );
}
