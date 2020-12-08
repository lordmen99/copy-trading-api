import config from '@src/config';
import scheduler from 'node-schedule';
import executeEveryMinute from './executeEveryMinute';
import executeEveryMonth from './executeEveryMonth';
export default class Scheduler {
  public config() {
    scheduler.scheduleJob(config.SCHEDULE_EXECUTE_EVERY_MINUTE, executeEveryMinute);
    scheduler.scheduleJob(config.SCHEDULE_EXECUTE_EVERY_MONTH, executeEveryMonth);
  }
}
