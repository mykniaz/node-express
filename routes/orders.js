import {Router} from 'express';
import OrderModel from '../models/order'

const router = Router();

const mapCourses = (courses) => {
  return courses.map(({count, courseId}) => ({
    count,
    id: courseId._id,
    title: courseId.title,
    price: courseId.price,
    totalPrice: courseId.price * count,
  }))
};

const computePrice = (courses) => {
  return courses.reduce((acc, course) => acc + course.totalPrice, 0);
};

router.get('/', async (req, res) => {
  try {
    const orders = await OrderModel
      .find({
        userId: req.user._id,
      }).populate('courses.courseId').exec();

    res.render('orders',{
      title: 'Orders',
      isOrders: true,
      orders: orders.map(({courses, _id}) => {
        const formattedCourses = mapCourses(courses);

        return {
          id: _id,
          totalPrice: computePrice(formattedCourses),
          courses: formattedCourses,
        }
      }),
    });
  } catch (e) {
    console.error(e);
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate();

    const courses = user.cart.items.map((item) => ({
      count: item.count,
      courseId: item.courseId,
    }));

    const order = new OrderModel({
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


module.exports = router;
