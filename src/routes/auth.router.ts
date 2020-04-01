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
  const {email, password} = req.body;

  try {
    const user: IUserDocument = await User.findOne({
      email,
      password,
    });

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
});

router.post('/logout', async (req: Request, res: Response) => {
  req.session.destroy(() => {res.redirect('/auth#login')});
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      confirm,
    } = req.body;

    if (password !== confirm) {
      return res.redirect('/auth#register')
    }

    const candidate = await User.findOne({email})

    if (candidate) {
      return res.redirect('/auth#register')
    }

    const user = new User;

    await user.register({name, email, password});

    res.redirect('/auth#login')
  } catch (e) {
    console.error(e)
  }
});

export default router;
