import {Router} from 'express';
import Course from "../models/course";

const router = Router();

const mapCartItems = (cart) => {
  return cart.items.map(course => ({
    count: course.count,
    id: course.courseId._id,
    title: course.courseId.title,
    price: course.courseId.price,
    totalPrice: course.courseId.price * course.count,
  }));
};

const computePrice = (courses) => {
  return courses.reduce((acc, course) => acc + course.totalPrice, 0);
};

router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = mapCartItems(user.cart);

  res.render('cart', {
    title: 'Cart',
    isCart: true,
    totalPrice: computePrice(courses),
    courses,
  })
});

router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);

  const user = await req.user.populate('cart.items.courseId').execPopulate();

  const courses = mapCartItems(user.cart);
  const cart = {
    totalPrice: computePrice(courses),
    courses,
  }

  res.status(200).json(cart);
});

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);

  console.log(req.user)

  await req.user.addToCart(course);

  res.redirect('/courses');
});

module.exports = router;

