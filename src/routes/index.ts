import {Router} from 'express';
import AdminsRouter from './admins';
import ExpertsRouter from './experts';
import TradingCopyRouter from './tradingCopy';
import TradingGainRouter from './tradingGain';
import TradingHistoryRouter from './tradingHistory';
import TradingOrderRouter from './tradingOrder';
import UsersRouter from './users';
import WalletRouter from './wallet';

class MainRoutes {
  public routers: Router;

  constructor() {
    this.routers = Router();
    this.config();
  }

  private config() {
    this.routers.use('/users', new UsersRouter().router);
    this.routers.use('/trading_history', new TradingHistoryRouter().router);
    this.routers.use('/trading_copy', new TradingCopyRouter().router);
    this.routers.use('/trading_order', new TradingOrderRouter().router);
    this.routers.use('/experts', new ExpertsRouter().router);
    this.routers.use('/admins', new AdminsRouter().router);
    this.routers.use('/trading_gain', new TradingGainRouter().router);
    this.routers.use('/wallet', new WalletRouter().router);
  }
}

export default new MainRoutes().routers;
