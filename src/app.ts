import * as path from 'path';
import env from './env'

// Express
import * as express from 'express';
import * as ExpressHandlebars from 'express-handlebars';
import * as csrf from 'csurf';
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Middleware
import varMiddleware from './middlewares/variables.middleware'
import userMiddleware from './middlewares/user.middleware'

// Routes
import addRoutes from './routes/add.router';
import homeRoutes from './routes/home.router';
import authRouter from './routes/auth.router';
import cartRoutes from './routes/cart.router';
import coursesRoutes from './routes/courses.router';
import ordersRoutes from './routes/orders.router';

const app: express.Application = express();

const hbs = ExpressHandlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set(
  'views',
  path.join(__dirname, '/views',)
);

app.use(express.static(path.join(
  __dirname,
  '../public'
)));

const store = new MongoDBStore({
  collection: 'sessions',
  uri: env.DB_URI,
});

app.use(express.urlencoded({
  extended: true,
}));
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csrf());
app.use(varMiddleware);
app.use(userMiddleware);
app.use(flash());

app.use('/', homeRoutes);
app.use('/auth', authRouter);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);

export default app
