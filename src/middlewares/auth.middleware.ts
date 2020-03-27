import {Response, NextFunction} from 'express';
import {IRequestWithUser} from './user.middleware';

export default function(req: IRequestWithUser, res: Response, next: NextFunction) {
  if (!req.session.isAuthenticated) {
    return res.redirect('/auth#login')
  }

  next();
}
