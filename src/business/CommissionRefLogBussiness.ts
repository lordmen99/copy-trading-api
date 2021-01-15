import {COMMISSION_LEVEL} from '@src/contants/CommissionLevel';
import CommissionRefLogRepository from '@src/repository/CommissionRefLogRespository';
import UserRepository from '@src/repository/UserRepository';
import {utilities} from '@src/utils';

export default class CommissionRefLogBussiness {
  private _commissionRefLogRepository: CommissionRefLogRepository;
  private _userRepository: UserRepository;

  constructor() {
    this._commissionRefLogRepository = new CommissionRefLogRepository();
    this._userRepository = new UserRepository();
  }

  public async CalcularCommissionRef(): Promise<void> {
    try {
      const commissionRefHistory = await this._commissionRefLogRepository.getCommissionHistory();
      if (commissionRefHistory.length <= 0) return;
      const listUserRef = [];
      const amountUserRef = [];
      commissionRefHistory.map(async (item) => {
        let totalAmountRef = 0;
        item.history_logs.map((x, index: number) => {
          console.log(COMMISSION_LEVEL[x.level - 1], 'COMMISSION_LEVEL[x.level - 1]');
          const amount = Number(
            utilities.formatter.format(x.amount - (x.amount * COMMISSION_LEVEL[x.level - 1]) / 100),
          );
          totalAmountRef += amount;
          listUserRef.push({
            id: x.id,
            amountRef: amount,
          });
        });
        const user = await this._userRepository.findOne({id_user_trading: item._id});
        amountUserRef.push({
          id: user.id,
          amount: totalAmountRef,
        });
      });
      console.log(listUserRef, 'listUserRef');
      console.log(amountUserRef, 'amountUserRef');
    } catch (err) {
      throw err;
    }
  }
}
