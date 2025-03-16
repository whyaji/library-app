import { hc } from 'hono/client';

import { type ApiRoutes } from '@server/app';

const client = hc<ApiRoutes>('/');

const api = client.api.v1;

export default api;
