import http from 'http';
import 'module-alias/register';
import mongoose from 'mongoose';
import {Server} from 'socket.io';
import IOClient from 'socket.io-client';
import app from './App';
import config from './config';
import IOHandlers from './socketHandlers/EventHandlers';
import TradingEventHandlers from './socketHandlers/tradingEventHandlers';

/** socket kết nối với bên server trading để lấy các thông tin cần thiết */
const socketTrading = IOClient(config.SERVER_TRADING_URI, {path: config.SOCKET_TRADING_URI});
TradingEventHandlers(socketTrading);

/** cấu hình port chạy ứng dụng */
app.set('port', config.port);

/** khởi tạo server */
const server = http.createServer(app);

/** khởi tạo hệ thống socket bên phía copytrading */
const io: Server = new Server(server, {path: '/io-copy-trading'});
/** các events khi sockets thực hiện */
IOHandlers(io);

/** khởi động server */
server.listen(config.port);
server.on('listening', () => {
  mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
  mongoose.connection.once('open', () => {
    console.info('\n🚀Connected to Mongo via Mongoose');
    console.info(
      `\n🚀Server listening on port: ${config.port} - env: ${process.env.NODE_ENV}
      \n🚀API Document on http://localhost:${config.port}/apidoc/index.html`,
    );
  });
  mongoose.connection.on('error', (err) => {
    console.error('\n🚀Unable to connect to Mongo via Mongoose', err);
  });
});
server.on('error', (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof config.port === 'string' ? 'Pipe ' + config.port : 'Port ' + config.port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
});
