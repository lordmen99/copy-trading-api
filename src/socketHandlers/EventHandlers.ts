import logger from '@src/middleware/Logger';
import {Server, Socket} from 'socket.io';
import {ExtendedError} from 'socket.io/dist/namespace';
import TradingSystem from './events/TradingSystem';
import {AppData, SocketHandler} from './EventTypes';

const app: AppData = {
  allSockets: [],
};

export default (io: Server) => {
  try {
    io.use(async (socket: Socket, next: (err?: ExtendedError) => void) => {
      try {
        const token = socket.handshake.query['token'];
        // if (token) {
        //   const accessTokenRes = new AccessTokenRepository();
        //   const accessToken = await accessTokenRes.findOne({token} as IAccessTokenModel);
        //   if (!accessToken) return done({code: 403, type: 'invalidToken', message: 'Token invalid'});

        //   if (accessToken.type === contants.TYPE_OF_CLIENT.USER) {
        //     const userRepository = new UserRepository();
        //     const realUserRepository = new RealUserRepository();
        //     const realUser = await realUserRepository.findById(accessToken.id_client);
        //     if (realUser) {
        //       done(null, realUser);
        //     } else {
        //       const user = await userRepository.findById(accessToken.id_client);
        //       if (!user) return done(null, false, {message: 'Unknown User', scope: '*'});
        //       else done(null, user);
        //     }
        //   }
        //   if (accessToken.type === contants.TYPE_OF_CLIENT.EXPERT) {
        //     const expertRepository = new ExpertRepository();
        //     const expert = await expertRepository.findById(accessToken.id_client);
        //     if (!expert) return done(null, false, {message: 'Unknown Expert', scope: '*'});
        //     done(null, expert);
        //   }
        // }
        next();
      } catch (error) {
        logger.error(`SOCKET AUTHORIZE ERROR: ${error.message}`);
      }
    });

    io.on('connection', (socket: SocketHandler<any, any>) => {
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
    logger.error(`SOCKET CONNECT ERROR: ${error.message}`);
  }
};
