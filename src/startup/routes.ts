import { Express } from 'express';
import 'express-async-errors';

import { userRouter } from '../routes/users';
import { NotFoundError } from '../errors/not-found-error';
import { errorHandler } from '../middlewares/error-handler';

export const setupRoutes = (app: Express) => {
  app.use('/api/v1/users', userRouter);

  app.use('*', async (req, res) => {
    throw new NotFoundError();
  });

  app.use(errorHandler);
};
