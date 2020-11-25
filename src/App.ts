import {json, urlencoded} from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import {Manager} from 'socket.io-client';
import config from './config';
import {errorMiddleware, notFoundMiddleware} from './middleware/Exceptions';
import routes from './routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.socketConnectTrading();
  }

  private config() {
    this.app.use(express.static(`${__dirname}/wwwroot`));
    this.app.use(cors({origin: '*', methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS']}));
    this.app.use(compression());
    /** support application/json type post data */
    this.app.use(json({limit: '10MB'}));
    this.app.use(urlencoded({extended: true}));
    /** middle-ware that initialises Passport */
    this.app.use(passport.initialize());
    // auth();
    // this.app.post('/api/v1/oauth/token', token);
    /** add routes */
    this.app.use('/api/v1', routes);
    /** not found error */
    this.app.use(notFoundMiddleware);
    /** internal server Error  */
    this.app.use(errorMiddleware);
  }

  private socketConnectTrading() {
    try {
      console.log('2222');
      const manager = new Manager(`ws://localhost:6789/`, {path: config.SOCKET_TRADING_URI});

      const socket = manager.socket('/');
      socket.on('commit', (data) => {
        console.log(`connect ${socket.id}`);
      });
    } catch (error) {
      console.log('SOCKET TRADING: ' + error.message);
    }
  }
}

export default new App().app;
