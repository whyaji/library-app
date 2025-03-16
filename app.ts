import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { booksRoute } from './routes/books.js';

export const app = new Hono();

app.use('*', logger());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/api/books', booksRoute);
