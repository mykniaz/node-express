import {Router} from 'express';

import Course from "../models/course";

const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find()


  res.render('courses',{
    title: 'Courses',
    isCourses: true,
    courses: courses.map(({_id, title, price, img}) => ({id: _id, title, price, img})),
  });
});

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    res.redirect('/');

    return;
  }

  const {_id, title, price, img} = await Course.findById(req.params.id);

  res.render('course-edit',{
    title: `Edit ${title}`,
    isCourses: true,
    course: {id: _id, title, price, img},
  });
});

router.post('/edit', async (req, res) => {
  if (!req.query.allow) {
    res.redirect('/');

    return;
  }

  const {id, ...rest} = req.body;

  await Course.findByIdAndUpdate(id, rest);

  res.redirect(`/courses/${id}`);
});

router.get('/:id', async (req, res) => {
  const {_id, title, price, img} = await Course.findById(req.params.id);

  res.render('course',{
    title: 'Course',
    isCourses: true,
    course: {id: _id, title, price, img},
  });
});

module.exports = router;
