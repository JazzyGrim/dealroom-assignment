import type { InputHTMLAttributes } from 'react';
import { cn } from '#/shared/lib/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm placeholder:text-muted',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand',
        className,
      )}
      {...props}
    />
  );
}
