import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Card } from './Card';

export interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-2 p-10 text-center">
      <Inbox className="size-8 text-muted" aria-hidden />
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </Card>
  );
}
