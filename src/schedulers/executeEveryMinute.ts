import TradingCopyBussiness from '@src/business/TradingCopyBussiness';
import TradingWithdrawBussiness from '@src/business/TradingWithdrawBussiness';
import UserBussiness from '@src/business/UserBussiness';
import {logger} from '@src/middleware';
import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import TradingWithdrawRepository from '@src/repository/TradingWithdrawRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants} from '@src/utils';

export default (date: Date) => {
  try {
    const tradingWithdrawBussiness = new TradingWithdrawBussiness();
    const tradingCopyBussiness = new TradingCopyBussiness();

    // mở khoá cho user được phép copy sau 24h
    const userBussiness = new UserBussiness();
    userBussiness.executeUnblockUser(date);

    // trả tiền lãi cho user sau 24h kể từ khi ngừng copy
    tradingWithdrawBussiness.getListPendingWithdraw(date).then(async (listWithdraws) => {
      // listWithdraws.map((withdraw) => {});
      // for (const withdraw of listWithdraws) {
      Promise.all(listWithdraws).then((result) => {
        const list = [];
        result.map(async (withdraw: ITradingWithdrawModel) => {
          if (list.length > 0) {
            let check = false;

            for (const item of list) {
              if (item.id_user.toString() === withdraw.id_user.toString()) {
                check = true;
                item.amount += withdraw.amount;
              }
            }
            if (check === false) {
              list.push(withdraw);
            }
          } else {
            list.push(withdraw);
          }
        });
        list.map(async (withdraw: ITradingWithdrawModel) => {
          const _userRepository = new UserRepository();

          const user = await _userRepository.findOne({
            _id: withdraw.id_user,
          });
          await _userRepository.update(user._id, {
            total_amount: user.total_amount + withdraw.amount,
          });
        });
        result.map(async (withdraw: ITradingWithdrawModel) => {
          // const _userRepository = new UserRepository();
          const _tradingWithdrawRepository = new TradingWithdrawRepository();

          // const user = await _userRepository.findOne({
          //   _id: withdraw.id_user,
          // });
          // await _userRepository.update(user._id, {
          //   total_amount: user.total_amount + withdraw.amount,
          // });
          await _tradingWithdrawRepository.update(withdraw._id, {
            status: contants.STATUS.FINISH,
            updatedAt: new Date(),
          });
        });
      });
      // await tradingCopyBussiness.transferMoneyAfterStopCopy(withdraw);
      // }
    });

    // trả 5% cho expert vào 23h59 cùng ngày

    tradingWithdrawBussiness
      .getListPendingTradingWithdraw(date)
      .then(async (listWithdraws: ITradingWithdrawModel[]) => {
        // listWithdraws.map(async (withdraw: ITradingWithdrawModel) => {
        // });
        for (const withdraw of listWithdraws) {
          await tradingCopyBussiness.transferMoneyToExpert(withdraw);
        }
      });
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
