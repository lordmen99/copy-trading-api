import {Router} from 'express';
import getListTradingHistories from './GetListTradingHistories';

export default class TradingHistoryRouter {
  public router: Router = Router();

  constructor() {
    getListTradingHistories(this.router);
  }
}
