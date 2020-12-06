import {Router} from 'express';
import getListTradingHistories from './GetListTradingHistories';
import getListTradingHistoriesByExpert from './GetListTradingHistoriesByExpert';
import getListTradingHistoriesByUser from './GetListTradingHistoriesByUser';
import getListTradingHistoriesFollowExpert from './GetListTradingHistoriesFollowExpert';

export default class TradingHistoryRouter {
  public router: Router = Router();

  constructor() {
    getListTradingHistories(this.router);
    getListTradingHistoriesByUser(this.router);
    getListTradingHistoriesByExpert(this.router);
    getListTradingHistoriesFollowExpert(this.router);
  }
}
