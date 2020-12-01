import scheduler from 'node-schedule';
import executeUnblockUser from './executeUnblockUser';
export default class Scheduler {
  public config() {
    scheduler.scheduleJob('*/30 * * * * *', executeUnblockUser);
  }
}
