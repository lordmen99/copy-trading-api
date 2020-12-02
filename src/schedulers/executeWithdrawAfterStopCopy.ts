import TradingCopyBussiness from '@src/business/TradingCopyBussiness';
import TradingWithdrawBussiness from '@src/business/TradingWithdrawBussiness';
import {logger} from '@src/middleware';

export default () => {
  try {
    const tradingWithdrawBussiness = new TradingWithdrawBussiness();
    const tradingCopyBussiness = new TradingCopyBussiness();

    tradingWithdrawBussiness.getListPendingWithdraw().then((listWithdraws) => {
      listWithdraws.map((withdraw) => {
        tradingCopyBussiness.transferMoneyAfterStopCopy(withdraw);
      });
    });
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
