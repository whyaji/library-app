import { zValidator } from '@hono/zod-validator';
import { count, eq, like } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import { booksSchema } from '../db/schema/schema.js';
import authMiddleware from '../middleware/jwt.js';

const bookSchemaZod = z.object({
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

const createPostSchema = bookSchemaZod.omit({ id: true });

export type Book = z.infer<typeof bookSchemaZod>;

export const booksRoute = new Hono()
  .use(authMiddleware)
  .get('/', async (c) => {
    const search = c.req.query('search');
    const page = parseInt(c.req.query('page') ?? '1');
    const limit = parseInt(c.req.query('limit') ?? '10');
    const offset = (page - 1) * limit;

    console.log({ search, page, limit, offset });

    // Base query
    const query =
      search && search !== ''
        ? db
            .select()
            .from(booksSchema)
            .where(like(booksSchema.title, `%${search}%`))
        : db.select().from(booksSchema);

    // Execute the query with pagination
    const books = await query.limit(limit).offset(offset);

    // Get total count of books (with search filter if applicable)
    const totalQuery = db.select({ count: count() }).from(booksSchema);
    if (search) {
      totalQuery.where(like(booksSchema.title, `%${search}%`));
    }
    const total = await totalQuery;

    return c.json({
      data: books,
      total: total[0].count,
      totalPage: Math.ceil(total[0].count / limit),
      page,
      limit,
    });
  })
  .get('/total', async (c) => {
    const total = await db.select({ count: count() }).from(booksSchema);
    return c.json({ total: total[0].count });
  })
  .post('/', zValidator('json', createPostSchema), async (c) => {
    const book = c.req.valid('json');
    await db.insert(booksSchema).values(book);
    return c.json({ message: 'Book created' }, 201);
  })
  .get('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const book = await db.select().from(booksSchema).where(eq(booksSchema.id, id)).limit(1);
    if (!book[0]) {
      return c.notFound();
    }
    return c.json({ data: book[0] });
  })
  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(booksSchema).where(eq(booksSchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Book deleted' });
  })
  .put('/:id{[0-9]+}', zValidator('json', bookSchemaZod), async (c) => {
    const id = parseInt(c.req.param('id'));
    const book = c.req.valid('json');
    const updated = await db.update(booksSchema).set(book).where(eq(booksSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Book updated' });
  });
