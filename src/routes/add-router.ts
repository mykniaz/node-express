import {Request, Response, Router} from 'express';
import Course from '../models/course-model';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('add',{
    title: 'Add course',
    isAdd: true,
  });
});

router.post('/', async (req: Request, res: Response) => {
  const {title, price, img} = req.body;
  const course = new Course({
    title,
    price,
    img,
    userId: req.session.user._id,
  });

  try {
    await course.save()
  } catch (e) {
    console.error(e)
  }


  res.redirect('/courses');
});

export default router;
