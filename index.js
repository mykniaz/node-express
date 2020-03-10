import express from 'express';
import mongoose from 'mongoose'
import ExpressHandlebars from 'express-handlebars';
import path from "path";

// Routes
import homeRoutes from './routes/home';
import addRoutes from './routes/add';
import coursesRoutes from'./routes/courses';
import cardRoutes from'./routes/card';

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

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

const DB_USR = 'node-express';
const DB_PWD = 'node-express';
const CONNECTION_STR = `mongodb+srv://${DB_USR}:${DB_PWD}@cluster0-qajvx.mongodb.net/shop?retryWrites=true&w=majority`;

async function connect(str) {
  try {
    await mongoose.connect(str, {useNewUrlParser: true});
  } catch (e) {
    throw e;
  }
}

connect(CONNECTION_STR).then(() => {
  app.listen(PORT, () => {
    console.info(`Server started on port http://localhost:${PORT}`)
  });
});
