import {Router} from 'express';
import createTradingCopy from './CreateTradingCopy';
import getListTradingCopies from './GetListTradingCopies';
import getListTradingCopiesStop from './GetListTradingCopiesStop';
import getListTradingCopiesStopAdmin from './GetListTradingCopiesStopAdmin';
import getTradingCopyById from './GetTradingCopyById';
import getUserCopyByExpert from './GetUserCopyByExpert';
import getUserStopCopyByExpert from './GetUserStopCopyByExpert';
import pauseTradingCopy from './PauseTradingCopy';
import resumeTradingCopy from './ResumeTradingCopy';
import stopTradingCopy from './StopTradingCopy';
import transferMoneyToTradingCopy from './TransferMoneyToTradingCopy';

export default class TradingCopyRouter {
  public router: Router = Router();

  constructor() {
    stopTradingCopy(this.router);
    pauseTradingCopy(this.router);
    createTradingCopy(this.router);
    getTradingCopyById(this.router);
    getListTradingCopies(this.router);
    resumeTradingCopy(this.router);
    transferMoneyToTradingCopy(this.router);
    getUserCopyByExpert(this.router);
    getListTradingCopiesStop(this.router);
    getListTradingCopiesStopAdmin(this.router);
    getUserStopCopyByExpert(this.router);
  }
}
