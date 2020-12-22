import {Router} from 'express';
import getListTradingHistories from './GetListTradingHistories';
import getListTradingHistoriesByExpert from './GetListTradingHistoriesByExpert';
import getListTradingHistoriesByUser from './GetListTradingHistoriesByUser';
import GetListTradingHistoriesByUserAdmin from './GetListTradingHistoriesByUserAdmin';
import getListTradingHistoriesFollowExpert from './GetListTradingHistoriesFollowExpert';
import HotFixStatus from './HotFixStatus';

export default class TradingHistoryRouter {
  public router: Router = Router();

  constructor() {
    getListTradingHistories(this.router);
    getListTradingHistoriesByUser(this.router);
    getListTradingHistoriesByExpert(this.router);
    getListTradingHistoriesFollowExpert(this.router);
    GetListTradingHistoriesByUserAdmin(this.router);
    HotFixStatus(this.router);
  }
}
