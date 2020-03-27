import {Router, Request, Response} from 'express';
import auth from '../middlewares/auth.middleware'
import Order from '../models/order.model'
import {IRequestWithUser} from '../middlewares/user.middleware';

const router = Router();

const mapCourses = (courses: Array<any>) => {
  return courses.map(({count, courseId}) => ({
    count,
    id: courseId._id,
    title: courseId.title,
    price: courseId.price,
    totalPrice: courseId.price * count,
  }))
};

const computePrice = (courses: any) => {
  return courses.reduce((acc: number, course: any) => acc + course.totalPrice, 0);
};

router.get('/', auth, async (req: IRequestWithUser, res: Response) => {
  try {
    const orders = await Order
      .find({
        userId: req.user._id,
      })
      .populate('courses.courseId')
      .populate('userId')
      .exec();

    res.render('orders',{
      title: 'Orders',
      isOrders: true,
      orders: orders.map((order) => {
        const {courses, userId, _id} = order;
        const formattedCourses = mapCourses(courses);

        return {
          id: _id,
          userName: userId.name,
          totalPrice: computePrice(formattedCourses),
          courses: formattedCourses,
        }
      }),
    });
  } catch (e) {
    console.error(e);
  }
});

router.post('/', auth, async (req: IRequestWithUser, res: Response) => {
  try {
    const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate();

    const courses = user.cart.items.map((item: any) => ({
      count: item.count,
      courseId: item.courseId,
    }));

    const order = new Order({
      userId: req.user,
      courses,
    });

    await order.save();

    await user.clearCart();

    res.redirect('orders')
  } catch (e) {
    console.error(e);
    res.end()
  }
});


export default router;
