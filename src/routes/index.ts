import {Router} from 'express';
import ExpertsRouter from './experts';
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
    // this.routers.use('/trading', new TradingHistoryRouter().router);
    this.routers.use('/experts', new ExpertsRouter().router);
  }
}

export default new MainRoutes().routers;
