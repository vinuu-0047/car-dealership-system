import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import { UnauthorizedError } from '../lib/errors';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }
    const token = header.slice(7);
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      next(err);
    } else {
      next(new UnauthorizedError('Invalid or expired token'));
    }
  }
};
