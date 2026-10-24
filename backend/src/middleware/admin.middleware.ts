import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../lib/errors';

export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'ADMIN') {
    next(new ForbiddenError('Admin access required'));
    return;
  }
  next();
};
