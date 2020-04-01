import {Request, Response, NextFunction} from 'express';
import User, {IUserDocument} from '../models/user.model';

export interface IRequestWithUser extends Request{
  user: IUserDocument
}

export default async function(req: IRequestWithUser, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return next()
  }

  const user = await User.findById(req.session.user._id);
  req.user = user;

  next();
}
