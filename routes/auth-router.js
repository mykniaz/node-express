import {Router} from 'express';
import User from '../models/user-model'

const router = new Router();

router.get('/', async (req, res) => {
  res.render('auth/index', {
    title: 'Auth',
    isAuth: true,
  })
});

router.post('/login', async (req, res) => {
  const formData = req.body;

  console.log(formData);


  res.redirect('/')
});

router.post('/register', async (req, res) => {
  const formData = req.body;

  console.log(formData);

  res.redirect('/auth#login')
});

module.exports = router;
