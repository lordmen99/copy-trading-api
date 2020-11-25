import logger from '@src/middleware/Logger';
import {Server} from 'socket.io';
import TradingSystem from './events/TradingSystem';
import {AppData, Socket} from './EventTypes';

const app: AppData = {
  allSockets: [],
};

export default (io: Server) => {
  try {
    io.on('connect', (socket: Socket<any, any>) => {
      console.log('Connection Successfull 2222');
    });

    io.on('connection', (socket: Socket<any, any>) => {
      console.log('Connection Successfull');
      const eventHandlers = [TradingSystem(app, socket)];
      eventHandlers.forEach((handler) => {
        for (const eventName in handler) {
          socket.on(eventName, handler[eventName]);
        }
      });
      app.allSockets.push(socket);
    });

    io.on('connect_failed', () => {
      console.log('Connection Failed');
    });

    io.on('disconnect', () => {
      console.log('Disconnected');
    });

    io.on('Error ', () => {
      console.log('Disconnected');
    });
  } catch (error) {
    logger.error(`-----------------------BEGIN ERROR-------------------------------`);
    logger.error(`SOCKET ERROR: ${error.message}`);
    logger.error(`-----------------------END ERROR---------------------------------`);
  }
};
