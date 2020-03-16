import {Router} from 'express';
import Course from "../models/course";

const router = Router();

router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = user.cart.items.map(course => ({
    count: course.count,
    id: course.courseId._id,
    title: course.courseId.title,
    price: course.courseId.price,
    totalPrice: course.courseId.price * course.count,
  }));

  res.render('cart', {
    title: 'Cart',
    isCart: true,
    totalPrice: courses.reduce((acc, course) => acc + course.totalPrice, 0),
    courses: courses
  })
});

router.delete('/remove/:id', async (req, res) => {
  const cart = await Cart.remove(req.params.id);

  res.status(200).json(cart);
});

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);

  await req.user.addToCart(course)

  res.redirect('/courses');
});

module.exports = router;

