import {Router} from 'express';
import getListTradingHistories from './GetListTradingHistories';
import getListTradingHistoriesByExpert from './GetListTradingHistoriesByExpert';
import getListTradingHistoriesByUser from './GetListTradingHistoriesByUser';

export default class TradingHistoryRouter {
  public router: Router = Router();

  constructor() {
    getListTradingHistories(this.router);
    getListTradingHistoriesByUser(this.router);
    getListTradingHistoriesByExpert(this.router);
  }
}
