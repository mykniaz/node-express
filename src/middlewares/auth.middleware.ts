import {Request, Response, NextFunction} from 'express';

export default function(req: Request, res: Response, next: NextFunction) {
  res.locals.isAuthenticated = req.session.isAuthenticated;

  next();
}
