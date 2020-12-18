import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingGainRepository from '@src/repository/TradingGainRepository';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import TradingWithdrawRepository from '@src/repository/TradingWithdrawRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants} from '@src/utils';

export default class TradingCopyBussiness {
  private _tradingGainRepository: TradingGainRepository;
  private _userRepository: UserRepository;
  private _expertRepository: ExpertRepository;
  private _tradingWithdrawRepository: TradingWithdrawRepository;
  private _tradingHistoryRepository: TradingHistoryRepository;

  constructor() {
    this._tradingGainRepository = new TradingGainRepository();
    this._userRepository = new UserRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
    this._tradingHistoryRepository = new TradingHistoryRepository();
  }

  public async updateTradingGain(date): Promise<boolean> {
    try {
      const experts = await this._expertRepository.findWhere({status: contants.STATUS.ACTIVE});
      for (const expert of experts) {
        let result: ITradingHistoryModel[] = [];
        result = await this._tradingHistoryRepository.findWhere({
          id_expert: expert._id,
          closing_time: {
            $gte: new Date(new Date(date).setHours(0, 0, 0)),
            $lt: new Date(new Date(date).setHours(23, 59, 59)),
          },
        });
        if (result?.length > 0) {
          let profit = 0;
          for (const history of result) {
            if (history.profit === 0) {
              if (!history.id_user) {
                profit = profit - history.order_amount;
              }
            } else {
              if (history.id_user) {
                profit = profit + history.fee_to_expert;
              } else {
                profit = profit + history.profit - history.fee_to_trading;
              }
            }
          }
          await this._tradingGainRepository.create({
            id_expert: expert._id,
            total_gain: parseFloat(((profit / expert.base_amount) * 100).toFixed(2)),
            createdAt: new Date(date),
            updatedAt: new Date(date),
          } as ITradingGainModel);
        }
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}
