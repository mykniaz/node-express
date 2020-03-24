import express from 'express';
import mongoose from 'mongoose'
import ExpressHandlebars from 'express-handlebars';
import path from "path";

// Routes
import homeRoutes from './routes/home-router';
import authRouter from './routes/auth-router';
import addRoutes from './routes/add-router';
import coursesRoutes from'./routes/courses-router';
import cartRoutes from'./routes/cart-router';
import ordersRoutes from'./routes/orders-router';

// Models
import User from './models/user-model';

const app = express();

const hbs = ExpressHandlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(
  __dirname,
  '/public'
)));

app.use(express.urlencoded({
  extended: true,
}));

app.use(async (req, res, next) => {
  let  user;

  try {
    user = await User.findById('5e79e8d97fd1573fe46d1f5d');
  } catch (e) {
    console.error(e);
  }

  req.user = user;

  next();
});

app.use('/', homeRoutes);
app.use('/auth', authRouter);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3000;

const DB_USR = 'node-express';
const DB_PWD = 'node-express';
const CONNECTION_STR = `mongodb+srv://${DB_USR}:${DB_PWD}@cluster0-qajvx.mongodb.net/shop?retryWrites=true&w=majority`;

async function connect(str) {
  try {
    await mongoose.connect(str, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
  } catch (e) {
    throw e;
  }

  const candidate = await User.findOne();

  if (!candidate) {
    const user = new User({
      email: 'admin@gmail.com',
      name: 'admin',
      cart: {items: []},
    });

    await user.save()
  }
}

connect(CONNECTION_STR)
  .then(() => {
    app.listen(PORT, () => {
      console.info(`Server started on port http://localhost:${PORT}`)
    });
  })
  .catch(err => {
    console.error(`DB Connection Error: ${err.message}`);
  });
