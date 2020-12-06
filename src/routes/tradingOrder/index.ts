import {Router} from 'express';
import createTradingOrder from './CreateTradingOrder';
import EditTradingOrder from './EditTradingOrder';
import getListTradingOrders from './GetListTradingOrders';
import getListTradingOrdersByExpert from './GetListTradingOrdersByExpert';

export default class TradingCopyRouter {
  public router: Router = Router();

  constructor() {
    getListTradingOrders(this.router);
    createTradingOrder(this.router);
    getListTradingOrdersByExpert(this.router);
    EditTradingOrder(this.router);
  }
}
