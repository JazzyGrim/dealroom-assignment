import type { HTMLAttributes } from 'react';
import { cn } from '#/shared/lib/cn';

const TONES = {
  neutral: 'bg-surface-muted text-muted',
  brand: 'bg-brand-subtle text-brand',
  success: 'bg-success-subtle text-success',
  danger: 'bg-danger-subtle text-danger',
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof TONES;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', TONES[tone], className)}
      {...props}
    />
  );
}
