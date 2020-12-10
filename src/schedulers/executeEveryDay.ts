import TradingHistoryBussiness from '@src/business/TradingHistoryBussiness';
import {logger} from '@src/middleware';

export default (date: Date) => {
  try {
    // tính profit cho expert hàng ngày
    const tradingHistoryBussiness = new TradingHistoryBussiness();
    tradingHistoryBussiness.calculateProfitForExpertEveryDay(date);
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
