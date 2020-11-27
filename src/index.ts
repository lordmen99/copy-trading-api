import 'module-alias/register';
import mongoose from 'mongoose';
import app from './App';
import config from './config';

app.listen(config.port, () => {
  mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
  mongoose.connection.once('open', () => {
    console.info('\n🚀Connected to Mongo via Mongoose');
    console.info(
      `\n🚀Server listening on port: ${config.port} - env: ${process.env.NODE_ENV}
      \n🚀API Document on http://localhost:${config.port}/apidoc/index.html`,
    );
  });
  mongoose.connection.on('error',err => {
    console.error('\n🚀Unable to connect to Mongo via Mongoose', err);
  });
});
