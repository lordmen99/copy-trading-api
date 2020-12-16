import DataSocketBussiness from '@src/business/DataSocketBussiness';
import {logger} from '@src/middleware';

export default (date: Date) => {
  try {
    // xoa data socket
    const dataSocketBussiness = new DataSocketBussiness();

    dataSocketBussiness.clearDataSocket(date);
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
