import config from '@src/config';
import scheduler from 'node-schedule';
import executeDataSocket from './executeDataSocket';
import executeEveryDay from './executeEveryDay';
import executeEveryMinute from './executeEveryMinute';
import executeEveryMonth from './executeEveryMonth';

export default class Scheduler {
  public config() {
    scheduler.scheduleJob(config.SCHEDULE_EXECUTE_EVERY_MINUTE, executeEveryMinute);
    scheduler.scheduleJob(config.SCHEDULE_EXECUTE_EVERY_MONTH, executeEveryMonth);
    scheduler.scheduleJob(config.SCHEDULE_EXECUTE_EVERY_DAY, executeEveryDay);
    scheduler.scheduleJob(config.SCHEDULE_EXECUTE_DATA_SOCKET, executeDataSocket);
  }
}
