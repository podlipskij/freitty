import { CSSProperties } from 'react';
import { cx } from '@/ui/utils';
import styles from './index.module.css';

interface SkeletonProps {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  radius?: number;
  className?: string;
}

export function Skeleton({ width = '100%', height = 12, radius = 6, className }: SkeletonProps) {
  return (
    <span className={cx(styles.skeleton, className)} style={{ width, height, borderRadius: radius }} aria-hidden />
  );
}
