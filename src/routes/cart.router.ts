import {Router, Response} from 'express';
import Course, {ICourseDocument} from '../models/course.model';
import {IUserDocument} from '../models/user.model';
import auth from '../middlewares/auth.middleware'
import {IRequestWithUser} from '../middlewares/user.middleware';

const router = Router();

const mapCartItems = (cart: any) => {
  return cart.items.map((course: {count: number, courseId: ICourseDocument}) => ({
    count: course.count,
    id: course.courseId._id,
    title: course.courseId.title,
    price: course.courseId.price,
    totalPrice: course.courseId.price * course.count,
  }));
};

const computePrice = (courses: Array<any>) => {
  return courses.reduce((acc, course) => acc + course.totalPrice, 0);
};

router.get('/', auth, async (req: IRequestWithUser, res: Response) => {
  let user: IUserDocument = req.user;

  user = await user
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

router.delete('/remove/:id', auth, async (req: IRequestWithUser, res: Response) => {
  await req.user.removeFromCart(req.params.id);

  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = mapCartItems(user.cart);
  const cart = {
    totalPrice: computePrice(courses),
    courses,
  };

  res.status(200).json(cart);
});

router.post('/add', auth, async (req: IRequestWithUser, res: Response) => {
  const course = await Course.findById(req.body.id);

  await req.user.addToCart(course);

  res.redirect('/courses');
});

export default router;

