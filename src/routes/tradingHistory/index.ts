import {Router} from 'express';
import getTradingHistoryById from './GetTradingHistoryById';

export default class TradingHistoryRouter {
  public router: Router = Router();

  constructor() {
    getTradingHistoryById(this.router);
  }
}
