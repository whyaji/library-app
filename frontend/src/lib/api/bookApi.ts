import api from './api';

export async function getBooks(search: string, page: number, limit: number) {
  const res = await api.books.$get({
    query: { search, page, limit },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getBook(id: string) {
  const res = await api.books[':id{[0-9]+}'].$get({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function deleteBook(id: string) {
  const res = await api.books[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
