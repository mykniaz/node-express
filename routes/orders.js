import {Router} from 'express';
import OrdersModel from '../models/orders'

const router = Router();

router.get('/', async (req, res) => {
  res.render('orders',{
    title: 'Courses',
    isOrders: true,
    orders: [],
  });
});


module.exports = router;
