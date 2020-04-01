import {NextFunction, Request, Response} from 'express';

export default function(req: Request, res: Response, next: NextFunction) {
  const csrf = req.csrfToken();

  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrf = csrf;

  next();
}
