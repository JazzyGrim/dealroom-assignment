import type { SelectHTMLAttributes } from 'react';
import { cn } from '#/shared/lib/cn';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectProps<T extends string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: readonly SelectOption<T>[];
  onValueChange: (value: T) => void;
}

export function Select<T extends string>({ options, onValueChange, className, ...props }: SelectProps<T>) {
  return (
    <select
      className={cn(
        'h-10 rounded-lg border border-border bg-surface px-3 text-sm',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand',
        className,
      )}
      onChange={(e) => onValueChange(e.target.value as T)}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
