import env from './env'

import app from './app';
import * as mongoose from 'mongoose'

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
