import { Router } from 'express';
import Course from '../models/course';

const router = Router();

router.get('/', (req, res) => {
  res.render('add',{
    title: 'Add course',
    isAdd: true,
  });
});

router.post('/', async (req, res) => {
  const {title, price, img} = req.body;
  const course = new Course({
    title,
    price,
    img
  });

  try {
    await course.save()
  } catch (e) {
    console.error(e)
  }


  res.redirect('/courses');
});

module.exports = router;
