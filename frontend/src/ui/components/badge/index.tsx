import { ReactNode } from 'react';
import { Tone } from '@/ui/types';
import { cx } from '@/ui/utils';
import styles from './index.module.css';

interface BadgeProps {
  tone?: Tone;
  variant?: 'label' | 'pill';
  title?: string;
  children: ReactNode;
}

export function Badge({ tone = 'gray', variant = 'label', title, children }: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone], styles[variant])} title={title}>
      {children}
    </span>
  );
}
