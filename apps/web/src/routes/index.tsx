import { createFileRoute } from '@tanstack/react-router';
import { Card } from '#/shared/ui/Card';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <Card className="p-8">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <p className="mt-2 max-w-prose text-muted">
        The API is running at <code>/api/jobs</code>. See <code>ASSIGNMENT.md</code> for what to build.
      </p>
    </Card>
  );
}
