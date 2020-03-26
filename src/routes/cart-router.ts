import {Router, Request, Response} from 'express';
import Course, {ICourseModel} from '../models/course-model';
import {IUserModel} from '../models/user-model';

const router = Router();

const mapCartItems = (cart: any) => {
  return cart.items.map((course: {count: number, courseId: ICourseModel}) => ({
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

router.get('/', async (req: Request, res: Response) => {
  let user: IUserModel = req.session.user;

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

router.delete('/remove/:id', async (req: Request, res: Response) => {
  await req.session.user.removeFromCart(req.params.id);

  const user = await req.session.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = mapCartItems(user.cart);
  const cart = {
    totalPrice: computePrice(courses),
    courses,
  };

  res.status(200).json(cart);
});

router.post('/add', async (req: Request, res: Response) => {
  const course = await Course.findById(req.body.id);

  await req.session.user.addToCart(course);

  res.redirect('/courses');
});

export default router;

