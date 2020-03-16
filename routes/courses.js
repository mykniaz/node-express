import {Router} from 'express';
import {ObjectId} from 'mongoose'

import CourseModel from "../models/course";

const router = Router();

router.get('/', async (req, res) => {
  const courses = await CourseModel.find();


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

  const {_id, title, price, img} = await CourseModel.findById(req.params.id);

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

  await CourseModel.findByIdAndUpdate(id, rest);

  res.redirect(`/courses/${id}`);
});

router.post('/remove', async (req, res) => {
  if (!req.query.allow) {
    res.redirect('/');

    return;
  }

  try {
    await CourseModel.deleteOne({ _id: req.body.id});
  } catch (e) {
    console.error(e)
  }

  res.redirect(`/courses`);
});

router.get('/:id', async (req, res) => {
  const {_id, title, price, img} = await CourseModel.findById(req.params.id);

  res.render('course',{
    title: 'Course',
    isCourses: true,
    course: {id: _id, title, price, img},
  });
});

module.exports = router;
