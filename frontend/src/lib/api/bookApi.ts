import api from './api';

export async function getBooks(search: string, page: number, limit: number) {
  const res = await api.books.$get({
    search,
    page,
    limit,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
