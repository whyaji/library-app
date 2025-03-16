import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const bookSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3),
  publisher: z.string(),
  isbn: z.string(),
  issn: z.string(),
  author: z.string(),
  year: z.number(),
  price: z.number(),
  notes: z.string().nullable(),
});

const createPostSchema = bookSchema.omit({ id: true });

type Book = z.infer<typeof bookSchema>;

const fakeBooks: Book[] = [
  {
    id: 1,
    title: 'Book 1',
    publisher: 'Publisher 1',
    isbn: '123-456-789',
    issn: '987-654-321',
    author: 'Author 1',
    year: 2021,
    price: 10.99,
    notes: 'This is a book',
  },
  {
    id: 2,
    title: 'Book 2',
    publisher: 'Publisher 2',
    isbn: '123-456-789',
    issn: '987-654-321',
    author: 'Author 2',
    year: 2021,
    price: 10.99,
    notes: 'This is a book',
  },
];

export const booksRoute = new Hono()
  .get('/', (c) => {
    return c.json({ books: fakeBooks });
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
