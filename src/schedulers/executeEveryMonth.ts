import TradingCopyBussiness from '@src/business/TradingCopyBussiness';
import TradingHistoryBussiness from '@src/business/TradingHistoryBussiness';
import {logger} from '@src/middleware';

export default (date: Date) => {
  try {
    const tradingHistoryBussiness = new TradingHistoryBussiness();
    const tradingCopyBussiness = new TradingCopyBussiness();

    // tính profit cho expert hàng tháng
    tradingHistoryBussiness.calculateProfitForExpert(date);

    // tính copier cho expert hàng tháng
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
