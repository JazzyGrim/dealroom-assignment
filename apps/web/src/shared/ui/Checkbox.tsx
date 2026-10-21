import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '#/shared/lib/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: ReactNode;
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox({ label, onCheckedChange, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2 text-sm', className)}>
      <input
        type="checkbox"
        className="size-4 rounded border-border accent-brand"
        onChange={(e) => onCheckedChange(e.target.checked)}
        {...props}
      />
      {label}
    </label>
  );
}
