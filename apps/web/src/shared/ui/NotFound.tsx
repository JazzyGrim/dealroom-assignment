import { Link } from '@tanstack/react-router';
import { EmptyState } from './EmptyState';

export function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="This page doesn't exist yet."
      action={
        <Link to="/" className="text-sm font-medium text-brand hover:underline">
          Back home
        </Link>
      }
    />
  );
}
