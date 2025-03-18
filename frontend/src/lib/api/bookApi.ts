import { Book } from '@server/routes/books';

import api from './api';

const bookApi = api.books;

export async function createBook(book: Omit<Book, 'id'>) {
  const res = await bookApi.$post({
    json: book,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getBooks(search: string, page: number, limit: number) {
  const res = await bookApi.$get({
    query: { search, page, limit },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getBook(id: string) {
  const res = await bookApi[':id{[0-9]+}'].$get({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: Book }>;
}

export async function updateBook(book: Book) {
  const res = await bookApi[':id{[0-9]+}'].$put({
    json: book,
    param: { id: book.id.toString() },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function deleteBook(id: string) {
  const res = await bookApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
