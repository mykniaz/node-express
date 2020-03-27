import env from './env'

import app from './app';
import * as mongoose from 'mongoose'

// Models
import User from './models/user.model';

const PORT = env.PORT || 3000;

async function connect(str: string) {
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

connect(env.DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.info(`Server started on port http://localhost:${PORT}`)
    });
  })
  .catch(err => {
    console.error(`DB Connection Error: ${err.message}`);
  });
