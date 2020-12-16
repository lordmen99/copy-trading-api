import DataSocketBussiness from '@src/business/DataSocketBussiness';
import TradingOrderBussiness from '@src/business/TradingOrderBussiness';
import {logger} from '@src/middleware';

export default (date: Date) => {
  try {
    // xử lý data socket
    const tradingOrderBussiness = new TradingOrderBussiness();
    const dataSocketBussiness = new DataSocketBussiness();

    dataSocketBussiness.getListDataSocket().then((data) => {
      if (data) {
        tradingOrderBussiness.executeListPendingOrders(data);
      }
    });
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
