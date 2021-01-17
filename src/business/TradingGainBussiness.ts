import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import ITradingGainEveryMonthModel from '@src/models/cpTradingGainEveryMonth/ITradingGainEveryMonthModel';
import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingGainEveryMonthRepository from '@src/repository/TradingGainEveryMonthRepository';
import TradingGainRepository from '@src/repository/TradingGainRepository';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import TradingOrderRepository from '@src/repository/TradingOrderRepository';
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
  private _tradingOrderRepository: TradingOrderRepository;

  constructor() {
    this._tradingGainRepository = new TradingGainRepository();
    this._userRepository = new UserRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
    this._tradingHistoryRepository = new TradingHistoryRepository();
    this._tradingGainEveryMonthRepository = new TradingGainEveryMonthRepository();
    this._tradingOrderRepository = new TradingOrderRepository();
  }

  public async updateTradingGain(date): Promise<boolean> {
    try {
      const experts = await this._expertRepository.findWhere({status: contants.STATUS.ACTIVE});
      for (const expert of experts) {
        let result: ITradingOrderModel[] = [];

        const trading_gain = await this._tradingGainRepository.findOne({
          id_expert: expert._id,
          createdAt: {
            $gte: new Date(new Date(date).setHours(0, 0, 0)),
            $lt: new Date(new Date(date).setHours(23, 59, 59)),
          },
        });
        if (trading_gain) {
          result = await this._tradingOrderRepository.findWhere({
            id_expert: expert._id,
            status: contants.STATUS.FINISH,
            timeSetup: {
              $gte: new Date(new Date(date).setHours(0, 0, 0)),
              $lt: new Date(new Date(date).setHours(23, 59, 59)),
            },
          });
          if (result?.length > 0) {
            let profit = 0;
            for (const order of result) {
              if (order.type_of_order === 'WIN') {
                profit += order.threshold_percent;
              } else if (order.type_of_order === 'LOSE') {
                profit -= order.threshold_percent;
              }
            }
            await this._tradingGainRepository.update(trading_gain._id, {
              id_expert: expert._id,
              total_gain: profit,
              createdAt: new Date(date),
              updatedAt: new Date(date),
            } as ITradingGainModel);
          }
        } else {
          result = await this._tradingOrderRepository.findWhere({
            id_expert: expert._id,
            status: contants.STATUS.FINISH,
            timeSetup: {
              $gte: new Date(new Date(date).setHours(0, 0, 0)),
              $lt: new Date(new Date(date).setHours(23, 59, 59)),
            },
          });
          if (result?.length > 0) {
            let profit = 0;
            for (const order of result) {
              if (order.type_of_order === 'WIN') {
                profit += order.threshold_percent;
              } else if (order.type_of_order === 'LOSE') {
                profit -= order.threshold_percent;
              }
            }
            await this._tradingGainRepository.create({
              id_expert: expert._id,
              total_gain: profit,
              createdAt: new Date(date),
              updatedAt: new Date(date),
            } as ITradingGainModel);
          }
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
