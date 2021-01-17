import { COMMISSION_LEVEL } from '@src/contants/CommissionLevel';
import ICommissionRefLogModel from '@src/models/cpCommissionRefLogs/ICommissionRefLogModel';
import CommissionRefLogRepository from '@src/repository/CommissionRefLogRespository';
import UserRepository from '@src/repository/UserRepository';

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
      await Promise.all(
        commissionRefHistory.map(async item => {
          let totalAmountRef = 0;
          item.history_logs.map((x: ICommissionRefLogModel) => {
            const amount = Number((x.amount * COMMISSION_LEVEL[x.level - 1]) / 100);
            totalAmountRef += amount;
            listUserRef.push({
              id: x.id,
              amountRef: amount,
            });
          });
          const user = await this._userRepository.findOne({ id_user_trading: item._id });
          amountUserRef.push({
            id: user.id,
            amount: totalAmountRef,
          });
        }),
      );
      console.log(listUserRef, 'listUserRef');
      /** cập nhật amount withdraw cho bản ghi trong commission_ref_log */
      if (listUserRef.length > 0)
        Promise.all(
          listUserRef.map(item => this._commissionRefLogRepository.updateAmountWithdraw(item.id, item.amountRef)),
        );

      console.log(amountUserRef, 'amountUserRef');
      /** cập nhật amount vào tổng amount của user */
      if (amountUserRef.length > 0)
        Promise.all(amountUserRef.map(item => this._userRepository.updateAmountUser(item.id, item.amount)));
    } catch (err) {
      throw err;
    }
  }

  public async getComissionOfUser(id_user: string, page: number, size: number, fromDate: Date, toDate: Date)
    : Promise<any> {
    try {
      const result = this._commissionRefLogRepository.getComissionOfUser(
        id_user,
        page,
        size,
        fromDate,
        toDate,
      );
      if (result) return result;
      return [];
    } catch (err) {
      throw err;
    }
  }
}
