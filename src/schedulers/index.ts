import config from '@src/config';
import scheduler from 'node-schedule';
import executeTransferFeeToExpert from './executeTransferFeeToExpert';
import executeUnblockUser from './executeUnblockUser';
import executeWithdrawAfterStopCopy from './executeWithdrawAfterStopCopy';
export default class Scheduler {
  public config() {
    scheduler.scheduleJob(config.SCHEDULE_EXECUTE_UNBLOCK_USER, executeUnblockUser);
    scheduler.scheduleJob(config.SCHEDULE_EXECUTE_TRANSFER_FEE_TO_EXPERT, executeTransferFeeToExpert);
    scheduler.scheduleJob(config.SCHEDULE_EXECUTE_WITHDRAW_AFTER_STOP_COPY, executeWithdrawAfterStopCopy);
  }
}
