import {Router} from 'express';
import createTradingCopy from './CreateTradingCopy';
import getUserCopyByExpert from './GetUserCopyByExpert';
import stopTradingCopy from './StopTradingCopy';

export default class TradingCopyRouter {
  public router: Router = Router();

  constructor() {
    stopTradingCopy(this.router);
    createTradingCopy(this.router);
    getUserCopyByExpert(this.router);
  }
}
