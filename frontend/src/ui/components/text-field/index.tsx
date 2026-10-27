import { InputHTMLAttributes, useId } from 'react';
import { cx } from '@/ui/utils';
import styles from './index.module.css';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
}

export function TextField({ label, error, className, ...inputProps }: TextFieldProps) {
  const id = useId();

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        className={cx(styles.input, error && styles.invalid)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
      />
      {error && (
        <div id={`${id}-error`} className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}
