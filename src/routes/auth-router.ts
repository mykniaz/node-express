import {Request, Response, Router} from 'express';
import User, {IUserModel} from '../models/user-model'

// @ts-ignore
const router: Router = new Router();

router.get('/', async (req: Request, res: Response) => {
  res.render('auth/index', {
    title: 'Auth',
    isAuth: true,
  })
});

router.post('/login', async (req: Request, res: Response) => {
  const formData = req.body;

  try {
    const user: IUserModel = await User.findById('5e79e8d97fd1573fe46d1f5d');

    req.session.user = user;
    req.session.isAuthenticated = true;

    await req.session.save((err => {
      if (err) {
        throw err
      } else {
        res.redirect('/')
      }
    }))
  } catch (e) {
    console.error()
    res.redirect('/auth#login')
  }

  console.log(formData);
});

router.post('/logout', async (req: Request, res: Response) => {
  req.session.destroy(() => {res.redirect('/auth#logout')});
});

router.post('/register', async (req: Request, res: Response) => {
  const formData = req.body;

  console.log(formData);

  res.redirect('/auth#login')
});

export default router;
