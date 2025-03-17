import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api/api';

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
});

async function getTotalBooks() {
  const res = await api.books.total.$get();
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-total-books'],
    queryFn: getTotalBooks,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-[350px] m-auto mt-6">
      <Card>
        <CardHeader>Total Books</CardHeader>
        <CardContent className="text-xl font-bold">
          {isPending ? <Skeleton className="h-5" /> : data?.total}
        </CardContent>
      </Card>
    </div>
  );
}
