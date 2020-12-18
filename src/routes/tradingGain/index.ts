import {Router} from 'express';
import createTradingGain from './CreateTradingGain';

export default class TradingCopyRouter {
  public router: Router = Router();

  constructor() {
    createTradingGain(this.router);
  }
}
