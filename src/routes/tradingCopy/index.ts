import {Router} from 'express';
import createTradingCopy from './CreateTradingCopy';
// import getTradingCopyById from './GetTradingCopyById';

export default class TradingCopyRouter {
  public router: Router = Router();

  constructor() {
    // getTradingCopyById(this.router);
    createTradingCopy(this.router);
  }
}
