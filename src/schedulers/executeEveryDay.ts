import TradingCopyBussiness from '@src/business/TradingCopyBussiness';
import TradingHistoryBussiness from '@src/business/TradingHistoryBussiness';
import {logger} from '@src/middleware';

export default (date: Date) => {
  try {
    // tính profit cho expert hàng ngày
    const tradingHistoryBussiness = new TradingHistoryBussiness();
    const tradingCopyBussiness = new TradingCopyBussiness();

    // cập nhật copier cho expert hàng ngày
    tradingHistoryBussiness.calculateProfitForExpertEveryDay(date);
    tradingCopyBussiness.updateUserCopier(date);
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
