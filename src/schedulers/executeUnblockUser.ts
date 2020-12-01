import UserBussiness from '@src/business/UserBussiness';
import {logger} from '@src/middleware';

export default (fireDate: Date) => {
  try {
    const userBussiness = new UserBussiness();
    userBussiness.executeUnblockUser();
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
