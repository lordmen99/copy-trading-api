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
    tradingWithdrawBussiness.getListPendingWithdraw().then((listWithdraws) => {
      listWithdraws.map((withdraw) => {
        if (
          withdraw.paidAt.getDate() === date.getDate() &&
          withdraw.paidAt.getMonth() === date.getMonth() &&
          withdraw.paidAt.getFullYear() === date.getFullYear() &&
          withdraw.paidAt.getHours() === date.getHours() &&
          withdraw.paidAt.getMinutes() === date.getMinutes()
        ) {
          tradingCopyBussiness.transferMoneyAfterStopCopy(withdraw);
        }
      });
    });

    // trả 5% cho expert vào 23h59 cùng ngày

    tradingWithdrawBussiness.getListPendingTradingWithdraw().then((listWithdraws) => {
      listWithdraws.map((withdraw) => {
        if (
          withdraw.paidAt.getDate() === date.getDate() &&
          withdraw.paidAt.getMonth() === date.getMonth() &&
          withdraw.paidAt.getFullYear() === date.getFullYear() &&
          withdraw.paidAt.getHours() === date.getHours() &&
          withdraw.paidAt.getMinutes() === date.getMinutes()
        ) {
          tradingCopyBussiness.transferMoneyToExpert(withdraw);
        }
      });
    });
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
