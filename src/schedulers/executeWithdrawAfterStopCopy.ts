import TradingCopyBussiness from '@src/business/TradingCopyBussiness';
import TradingWithdrawBussiness from '@src/business/TradingWithdrawBussiness';
import {logger} from '@src/middleware';

export default (date: Date) => {
  try {
    const tradingWithdrawBussiness = new TradingWithdrawBussiness();
    const tradingCopyBussiness = new TradingCopyBussiness();

    tradingWithdrawBussiness.getListPendingWithdraw().then((listWithdraws) => {
      listWithdraws.map((withdraw) => {
        if (
          withdraw.createdAt.getDate() === date.getDate() &&
          withdraw.createdAt.getMonth() === date.getMonth() &&
          withdraw.createdAt.getFullYear() === date.getFullYear() &&
          withdraw.createdAt.getHours() === date.getHours() &&
          withdraw.createdAt.getMinutes() === date.getMinutes()
        ) {
          tradingCopyBussiness.transferMoneyAfterStopCopy(withdraw);
        }
      });
    });
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
