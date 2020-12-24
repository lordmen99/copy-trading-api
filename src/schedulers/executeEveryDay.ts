import ExpertBussiness from '@src/business/ExpertBussiness';
import TradingCopyBussiness from '@src/business/TradingCopyBussiness';
import TradingHistoryBussiness from '@src/business/TradingHistoryBussiness';
import {logger} from '@src/middleware';

export default (date: Date) => {
  try {
    // tính profit cho expert hàng ngày
    const tradingHistoryBussiness = new TradingHistoryBussiness();
    tradingHistoryBussiness.calculateProfitForExpertEveryDay(date);

    // cập nhật copier cho expert hàng ngày
    const tradingCopyBussiness = new TradingCopyBussiness();
    tradingCopyBussiness.updateUserCopier(date);

    // chạy cộng dồn copier ảo cho expert
    const expertBussiness = new ExpertBussiness();
    expertBussiness.getListExpertAutoCopier().then(async (experts) => {
      for (const expert of experts) {
        await expertBussiness.autoGenCopier(expert);
      }
    });
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
