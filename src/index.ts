import 'module-alias/register';
import app from './App';
import config from './config';

app.listen(config.port, () =>
  console.log(
    `\n🚀Server listening on port: ${config.port} - env: ${process.env.NODE_ENV}
    \n🚀API Document on http://localhost:${config.port}/apidoc/index.html`,
  ),
);

export {app};
