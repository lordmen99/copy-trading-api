import TradingCopyBussiness from '@src/business/TradingCopyBussiness';
import TradingWithdrawBussiness from '@src/business/TradingWithdrawBussiness';
import UserBussiness from '@src/business/UserBussiness';
import {logger} from '@src/middleware';

export default (date: Date) => {
  try {
    const tradingWithdrawBussiness = new TradingWithdrawBussiness();
    const tradingCopyBussiness = new TradingCopyBussiness();

    // mở khoá cho user được phép copy sau 24h
    const userBussiness = new UserBussiness();
    userBussiness.executeUnblockUser(date);

    // trả tiền lãi cho user sau 24h kể từ khi ngừng copy
    tradingWithdrawBussiness.getListPendingWithdraw(date).then((listWithdraws) => {
      listWithdraws.map((withdraw) => {
        tradingCopyBussiness.transferMoneyAfterStopCopy(withdraw);
      });
    });

    // trả 5% cho expert vào 23h59 cùng ngày

    tradingWithdrawBussiness.getListPendingTradingWithdraw(date).then((listWithdraws) => {
      listWithdraws.map((withdraw) => {
        tradingCopyBussiness.transferMoneyToExpert(withdraw);
      });
    });
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
