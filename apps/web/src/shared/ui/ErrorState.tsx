import { AlertTriangle } from 'lucide-react';
import { toApiError } from '#/shared/api/errors';
import { Button } from './Button';
import { Card } from './Card';

export interface ErrorStateProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
}

export function ErrorState({ error, title = 'Something went wrong', onRetry }: ErrorStateProps) {
  const { message } = toApiError(error);
  return (
    <Card role="alert" className="flex flex-col items-center gap-2 border-danger/30 p-10 text-center">
      <AlertTriangle className="size-8 text-danger" aria-hidden />
      <h2 className="font-semibold">{title}</h2>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Card>
  );
}
