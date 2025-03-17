import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { booksRoute } from './routes/books.js';

const app = new Hono();

app.use('*', logger());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiRoutes = app.basePath('/api/v1').route('/books', booksRoute);

app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
