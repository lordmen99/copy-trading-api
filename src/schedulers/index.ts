import scheduler from 'node-schedule';
import executeTransferFeeToExpert from './executeTransferFeeToExpert';
import executeUnblockUser from './executeUnblockUser';
import executeWithdrawAfterStopCopy from './executeWithdrawAfterStopCopy';
export default class Scheduler {
  public config() {
    scheduler.scheduleJob('*/30 * * * * *', executeUnblockUser);
    // scheduler.scheduleJob('0 59 23 * * *', executeTransferFeeToExpert);
    scheduler.scheduleJob('0 */30 * * * *', executeTransferFeeToExpert); // setup 30 minutes to test
    scheduler.scheduleJob('*/30 * * * * *', executeWithdrawAfterStopCopy); // setup 30 minutes to test
  }
}
