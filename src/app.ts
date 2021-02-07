import express from 'express';
import { json } from 'body-parser';

import { setupRoutes } from './startup/routes';

const app = express();
app.use(json());

setupRoutes(app);

export { app };
