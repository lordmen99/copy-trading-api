import logger from '@src/middleware/Logger';
import {Server} from 'socket.io';
import TradingSystem from './events/TradingSystem';
import {AppData, Socket} from './EventTypes';

const app: AppData = {
  allSockets: [],
};

export default (io: Server) => {
  try {
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

    io.on('connect_error', (error) => {
      console.log(`Socket Connect Error: ${error}`);
    });

    io.on('error', (error) => {
      console.log(`Socket Error: ${error}`);
    });

    io.on('disconnect', (reason) => {
      console.log(`Socket Disconnected: ${reason}`);
    });
  } catch (error) {
    logger.error(`-----------------------BEGIN ERROR-------------------------------`);
    logger.error(`SOCKET ERROR: ${error.message}`);
    logger.error(`-----------------------END ERROR---------------------------------`);
  }
};
