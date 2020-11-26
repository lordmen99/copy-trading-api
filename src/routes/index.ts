import {Router} from 'express';
import ExpertsRouter from './experts';
import TradingCopyRouter from './tradingCopy';
// import TradingHistoryRouter from './tradingHistory';
import UsersRouter from './users';

class MainRoutes {
  public routers: Router;

  constructor() {
    this.routers = Router();
    this.config();
  }

  private config() {
    this.routers.use('/users', new UsersRouter().router);
    // this.routers.use('/trading_history', new TradingHistoryRouter().router);
    this.routers.use('/trading_copy', new TradingCopyRouter().router);
    this.routers.use('/experts', new ExpertsRouter().router);
  }
}

export default new MainRoutes().routers;
