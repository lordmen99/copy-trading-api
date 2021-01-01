import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import ITradingGainEveryMonthModel from '@src/models/cpTradingGainEveryMonth/ITradingGainEveryMonthModel';
import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingGainEveryMonthRepository from '@src/repository/TradingGainEveryMonthRepository';
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
  private _tradingGainEveryMonthRepository: TradingGainEveryMonthRepository;

  constructor() {
    this._tradingGainRepository = new TradingGainRepository();
    this._userRepository = new UserRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
    this._tradingHistoryRepository = new TradingHistoryRepository();
    this._tradingGainEveryMonthRepository = new TradingGainEveryMonthRepository();
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

  public async hotfixTradingGainEveryMonth(date): Promise<boolean> {
    try {
      const experts = await this._expertRepository.findWhere({status: contants.STATUS.ACTIVE});
      for (const expert of experts) {
        const trading_gains = await this._tradingGainRepository.findWhere({
          id_expert: expert._id,
          createdAt: {
            $gte: new Date(new Date(new Date(date).setDate(1)).setHours(0, 0, 0)),
            $lt: new Date(new Date(date).setHours(23, 59, 59)),
          },
        });
        let profit = 0;
        if (trading_gains.length > 0) {
          for (const trading_gain of trading_gains) {
            profit = profit + trading_gain.total_gain;
          }
          await this._tradingGainEveryMonthRepository.create({
            id_expert: expert._id,
            total_gain: parseFloat(profit.toFixed(2)),
            copier: 0,
            removed_copier: 0,
            createdAt: new Date(new Date(date).setHours(23, 59, 59)),
            updatedAt: new Date(new Date(date).setHours(23, 59, 59)),
          } as ITradingGainEveryMonthModel);
        } else {
          profit = 0;
          await this._tradingGainEveryMonthRepository.create({
            id_expert: expert._id,
            total_gain: parseFloat(profit.toFixed(2)),
            copier: 0,
            removed_copier: 0,
            createdAt: new Date(new Date(date).setHours(23, 59, 59)),
            updatedAt: new Date(new Date(date).setHours(23, 59, 59)),
          } as ITradingGainEveryMonthModel);
        }
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}
