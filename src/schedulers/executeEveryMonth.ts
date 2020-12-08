import TradingHistoryBussiness from '@src/business/TradingHistoryBussiness';
import {logger} from '@src/middleware';

export default (date: Date) => {
  try {
    const tradingHistoryBussiness = new TradingHistoryBussiness();

    // tính profit cho expert hàng tháng
    // tradingHistoryBussiness.calculateProfitForExpert(date);
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
