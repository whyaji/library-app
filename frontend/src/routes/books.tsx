import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';

export const Route = createFileRoute('/books')({
  component: Books,
});

async function getBooks(search: string, page: number, limit: number) {
  const res = await api.books.$get({
    search,
    page,
    limit,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

function Books() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [tempSearch, setTempSearch] = useState('');

  const totalPage = 10; // Replace this with the actual total number of pages from your API

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(tempSearch);
    }, 500);
    return () => clearTimeout(timeout);
  }, [tempSearch]);

  const { isPending, error, data } = useQuery({
    queryKey: ['get-books', search, page, limit],
    queryFn: () => getBooks(search, page, limit),
  });

  if (error) return <div>Error: {error.message}</div>;

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Show 5 page numbers at a time
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPage, startPage + maxPagesToShow - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Always show the first page
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={() => setPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Show the range of pages (up to 5 pages)
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink href="#" onClick={() => setPage(i)} isActive={i === page}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Always show the last page
    if (endPage < totalPage) {
      if (endPage < totalPage - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPage}>
          <PaginationLink href="#" onClick={() => setPage(totalPage)}>
            {totalPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Card className="p-4 m-8">
      <div className="flex justify-between">
        <h1>List of Books</h1>
        <Input
          className="w-100"
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          placeholder="Search"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {['ID', 'Title', 'Author', 'ISBN', 'ISSN', 'Publisher', 'Year', 'Price'].map((head) => (
              <TableHead key={head}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 8 }).map((_, subIndex) => (
                    <TableHead key={subIndex}>
                      <Skeleton className="h-5" />
                    </TableHead>
                  ))}
                </TableRow>
              ))
            : data?.data.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.issn}</TableCell>
                  <TableCell>{book.publisher}</TableCell>
                  <TableCell>{book.year}</TableCell>
                  <TableCell>{book.price}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <div className="flex flex-col items-center gap-4">
        <Pagination className="flex flex-row items-center justify-between">
          <PaginationContent className="w-40 justify-start">
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => setPage(Math.max(1, page - 1))} />
              </PaginationItem>
            )}
          </PaginationContent>
          <PaginationContent>{renderPaginationItems()}</PaginationContent>
          <PaginationContent className="w-40 justify-end">
            {page < totalPage && (
              <PaginationItem>
                <PaginationNext href="#" onClick={() => setPage(Math.min(totalPage, page + 1))} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
        <div className="flex flex-row gap-4 items-center">
          <h2>Items per page:</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-12">
                {limit}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-18">
              {[10, 20, 50, 100].map((item) => (
                <DropdownMenuItem key={item} onClick={() => setLimit(item)}>
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
