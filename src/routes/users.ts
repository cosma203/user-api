import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import { User } from '../models/User';
import { validateRequest, validateObjectId } from '../middlewares';
import { BadRequestError } from '../errors';

const router = Router();

router.post(
  '/',
  [
    body('email').isEmail().trim().withMessage('Invalid email provided'),
    body('givenName')
      .isString()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('givenName must be between 3 and 20 characters long'),
    body('familyName')
      .isString()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('familyName must be between 3 and 20 characters long'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, givenName, familyName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new BadRequestError('User with the provided email already exists');

    const user = User.build({ email, givenName, familyName });
    await user.save();

    res.status(201).send(user);
  }
);

router.get('/', async (req: Request, res: Response) => {
  const users = await User.find({});

  res.send(users);
});

router.get('/:id', validateObjectId, async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new BadRequestError('User with the provided id does not exist');

  res.send(user);
});

router.put(
  '/:id',
  [
    body('email').optional().isEmail().trim().withMessage('Invalid email provided'),
    body('givenName')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('givenName must be between 3 and 20 characters long'),
    body('familyName')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('familyName must be between 3 and 20 characters long'),
  ],
  [validateObjectId, validateRequest],
  async (req: Request, res: Response) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) throw new BadRequestError('User with the provided id does not exist');

    res.send(user);
  }
);

router.delete('/:id', validateObjectId, async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new BadRequestError('User with the provided id does not exist');

  res.send(user);
});

export { router as userRouter };
