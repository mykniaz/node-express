import {Router, Request, Response} from 'express';
import User, {IUserDocument} from '../models/user.model'

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.render('auth/index', {
    title: 'Auth',
    isAuth: true,
  })
});

router.post('/login', async (req: Request, res: Response) => {
  const formData = req.body;

  try {
    const user: IUserDocument = await User.findById('5e79e8d97fd1573fe46d1f5d');

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
    console.error(e);
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
