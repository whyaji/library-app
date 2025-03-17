import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import authMiddleware from '../middleware/jwt.js';

const bookSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3),
  category: z.string().min(3),
  publisher: z.string().min(3),
  isbn: z.string().min(3),
  issn: z.string().min(3),
  author: z.string().min(3),
  year: z.number().int().positive().min(1000).max(3000),
  price: z.number().int().positive().min(0),
  notes: z.string().nullable(),
});

const createPostSchema = bookSchema.omit({ id: true });

type Book = z.infer<typeof bookSchema>;

const fakeBooks: Book[] = [
  {
    id: 1,
    title: 'Book 1',
    category: 'Category 1',
    publisher: 'Publisher 1',
    isbn: '123-456-789',
    issn: '987-654-321',
    author: 'Author 1',
    year: 2021,
    price: 199000,
    notes: 'This is a book',
  },
  {
    id: 2,
    category: 'Category 2',
    title: 'Book 2',
    publisher: 'Publisher 2',
    isbn: '123-456-789',
    issn: '987-654-321',
    author: 'Author 2',
    year: 2021,
    price: 109900,
    notes: 'This is a book',
  },
];

export const booksRoute = new Hono()
  // use authMiddleware to protect routes
  .use(authMiddleware)
  .get('/', (c) => {
    // params: search (string), page (number), limit (number)
    const search = c.req.param('search');
    const page = parseInt(c.req.param('page') ?? '1');
    const limit = parseInt(c.req.param('limit') ?? '10');

    const offset = (page - 1) * limit;
    const filteredBooks = search ? fakeBooks.filter((b) => b.title.includes(search)) : fakeBooks;
    const books = filteredBooks.slice(offset, offset + limit);

    return c.json({ data: books, total: filteredBooks.length });
  })
  .get('/total', (c) => {
    return c.json({ total: fakeBooks.length });
  })
  .post('/', zValidator('json', createPostSchema), (c) => {
    const book = c.req.valid('json');
    const id = fakeBooks.length + 1;
    fakeBooks.push({ id, ...book });
    return c.json({ message: 'Book created' }, 201);
  })
  .get('/:id{[0-9]+}', (c) => {
    const id = parseInt(c.req.param('id'));
    const book = fakeBooks.find((b) => b.id === id);
    if (!book) {
      return c.notFound();
    }
    return c.json({ book });
  })
  .delete('/:id{[0-9]+}', (c) => {
    const id = parseInt(c.req.param('id'));
    const index = fakeBooks.findIndex((b) => b.id === id);
    if (index === -1) {
      return c.notFound();
    }
    fakeBooks.splice(index, 1);
    return c.json({ message: 'Book deleted' });
  })
  .put('/:id{[0-9]+}', zValidator('json', bookSchema), (c) => {
    const id = parseInt(c.req.param('id'));
    const book = c.req.valid('json');
    const index = fakeBooks.findIndex((b) => b.id === id);
    if (index === -1) {
      return c.notFound();
    }
    fakeBooks[index] = book;
    return c.json({ message: 'Book updated' });
  });
