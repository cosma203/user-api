import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { BadRequestError } from '../errors';

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    throw new BadRequestError('Invalid id provided');

  next();
};
