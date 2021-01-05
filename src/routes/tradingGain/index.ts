import {Router} from 'express';
import createTradingGain from './CreateTradingGain';
import hotfixTradingGainEveryMonth from './HotfixTradingGainEveryMonth';

export default class TradingCopyRouter {
  public router: Router = Router();

  constructor() {
    createTradingGain(this.router);
    hotfixTradingGainEveryMonth(this.router);
  }
}
