import {Request, Response, Router} from 'express';

import auth from '../middlewares/auth.middleware'

import Course from '../models/course.model';
import {IRequestWithUser} from '../middlewares/user.middleware';

const router = Router();

router.get('/', auth, (req: Request, res: Response) => {
  res.render('add',{
    title: 'Add course',
    isAdd: true,
  });
});

router.post('/', auth, async (req: IRequestWithUser, res: Response) => {
  const {title, price, img} = req.body;
  const course = new Course({
    title,
    price,
    img,
    userId: req.user._id,
  });

  try {
    await course.save()
  } catch (e) {
    console.error(e)
  }


  res.redirect('/courses');
});

export default router;
