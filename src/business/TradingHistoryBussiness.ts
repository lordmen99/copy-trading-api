import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import ITradingGainEveryMonthModel from '@src/models/cpTradingGainEveryMonth/ITradingGainEveryMonthModel';
import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingGainEveryMonthRepository from '@src/repository/TradingGainEveryMonthRepository';
import TradingGainRepository from '@src/repository/TradingGainRepository';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import TradingOrderRepository from '@src/repository/TradingOrderRepository';
import {contants} from '@src/utils';
import {CreateTradingHistory} from '@src/validator/trading_histories/trading_histories.validator';
import {validate} from 'class-validator';
import moment from 'moment';
import {Schema} from 'mongoose';

export default class TradingHistoryBussiness {
  private _tradingHistoryRepository: TradingHistoryRepository;
  private _expertRepository: ExpertRepository;
  private _tradingGainRepository: TradingGainRepository;
  private _tradingGainEveryMonthRepository: TradingGainEveryMonthRepository;
  private _tradingCopyRepository: TradingCopyRepository;
  private _tradingOrderRepository: TradingOrderRepository;

  constructor() {
    this._tradingHistoryRepository = new TradingHistoryRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingGainRepository = new TradingGainRepository();
    this._tradingGainEveryMonthRepository = new TradingGainEveryMonthRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
    this._tradingOrderRepository = new TradingOrderRepository();
  }

  public async getListTradingHistories(page: number, size: number): Promise<any> {
    try {
      const result = this._tradingHistoryRepository.findWithPaging(page, size);
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async getListTradingHistoriesByUser(
    id_user: Schema.Types.ObjectId,
    page: number,
    size: number,
    fromDate: Date,
    toDate: Date,
  ): Promise<any> {
    try {
      const result = this._tradingHistoryRepository.findWithPagingByUserWithAggregate(
        {id_user} as ITradingHistoryModel,
        page,
        size,
        'id_expert',
        '_id',
        'expert',
        'cp_experts',
        fromDate,
        toDate,
      );
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async getListTradingHistoriesFollowExpert(
    id_expert: Schema.Types.ObjectId,
    page: number,
    size: number,
    fromDate: Date,
    toDate: Date,
  ): Promise<any> {
    try {
      const expert = await this._expertRepository.findOneWithSelect({_id: id_expert}, 'fullname');
      if (expert) {
        const result = await this._tradingHistoryRepository.getListTradingHistoriesFollowExpert(
          {
            id_expert,
            id_user: {$ne: null} as any,
          } as ITradingHistoryModel,
          page,
          size,
          'id_user',
          '_id',
          'user',
          'cp_users',
          fromDate,
          toDate,
        );
        if (result) {
          return result;
        }
        return [];
      } else {
        throw new Error('Expert is not exist!');
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListTradingHistoriesByExpert(
    id_expert: Schema.Types.ObjectId,
    page: number,
    size: number,
    fromDate: Date,
    toDate: Date,
  ): Promise<any> {
    try {
      const expert = await this._expertRepository.findOneWithSelect({_id: id_expert}, 'fullname');
      if (expert) {
        const result = await this._tradingHistoryRepository.getListTradingHistoriesByExpert(
          {
            id_expert,
            id_user: null,
          } as ITradingHistoryModel,
          page,
          size,
          fromDate,
          toDate,
        );

        result.result.expert_name = expert.fullname;
        if (result) {
          return result;
        }
        return [];
      } else {
        throw new Error('Expert is not exist!');
      }
    } catch (err) {
      throw err;
    }
  }

  public async createTradingHistory(tradingHistory: CreateTradingHistory): Promise<ITradingHistoryModel> {
    try {
      const errors = await validate(tradingHistory);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const tradingHistoryEntity = tradingHistory as ITradingHistoryModel;
        const result = await this._tradingHistoryRepository.create(tradingHistoryEntity);
        if (result) {
          return result;
        }
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  public async calculateProfitForExpertEveryMonth(date: Date): Promise<void> {
    try {
      const experts = await this._expertRepository.findWhere({status: contants.STATUS.ACTIVE});
      for (const expert of experts) {
        const trading_gain_every_month = await this._tradingGainEveryMonthRepository.findOneSort({
          id_expert: expert._id,
        } as ITradingGainEveryMonthModel);
        if (trading_gain_every_month) {
          const trading_gains = await this._tradingGainRepository.findWhere({
            id_expert: expert._id,
            createdAt: {
              $gte: new Date(trading_gain_every_month.createdAt),
              $lt: date,
            },
          });

          const count_trading_copies = await this._tradingCopyRepository.count({
            id_expert: expert._id,
            createdAt: {
              $gte: moment(new Date(trading_gain_every_month.createdAt)),
              $lt: moment(date),
            } as any,
          } as ITradingCopyModel);

          let profit = 0;
          const removed_copier =
            trading_gain_every_month.copier > count_trading_copies
              ? trading_gain_every_month.copier - count_trading_copies
              : 0;
          if (trading_gains.length > 0) {
            for (const trading_gain of trading_gains) {
              profit = profit + trading_gain.total_gain;
            }

            await this._tradingGainEveryMonthRepository.create({
              id_expert: expert._id,
              total_gain: profit,
              copier: count_trading_copies,
              removed_copier,
              createdAt: new Date(new Date(date).getTime() - 60 * 60 * 24 * 1000),
              updatedAt: new Date(new Date(date).getTime() - 60 * 60 * 24 * 1000),
            } as ITradingGainEveryMonthModel);
          } else {
            profit = 0;
            await this._tradingGainEveryMonthRepository.create({
              id_expert: expert._id,
              total_gain: profit,
              copier: count_trading_copies,
              removed_copier,
              createdAt: new Date(date),
              updatedAt: new Date(date),
            } as ITradingGainEveryMonthModel);
          }
        } else {
          const trading_gains = await this._tradingGainRepository.findWhere({
            id_expert: expert._id,
            createdAt: {
              $lt: date,
            },
          });

          const count_trading_copies = await this._tradingCopyRepository.count({
            id_expert: expert._id,
            createdAt: {
              $lt: moment(date),
            } as any,
          } as ITradingCopyModel);

          let profit = 0;
          const removed_copier = 0;
          if (trading_gains.length > 0) {
            for (const trading_gain of trading_gains) {
              profit = profit + trading_gain.total_gain;
            }

            await this._tradingGainEveryMonthRepository.create({
              id_expert: expert._id,
              total_gain: parseFloat(profit.toFixed(2)),
              copier: count_trading_copies,
              removed_copier,
              createdAt: new Date(new Date(date).getTime() - 60 * 60 * 24 * 1000),
              updatedAt: new Date(new Date(date).getTime() - 60 * 60 * 24 * 1000),
            } as ITradingGainEveryMonthModel);
          } else {
            profit = 0;
            await this._tradingGainEveryMonthRepository.create({
              id_expert: expert._id,
              total_gain: parseFloat(profit.toFixed(2)),
              copier: count_trading_copies,
              removed_copier,
              createdAt: new Date(date),
              updatedAt: new Date(date),
            } as ITradingGainEveryMonthModel);
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async calculateProfitForExpertEveryDay(date: Date): Promise<void> {
    try {
      const experts = await this._expertRepository.findWhere({status: contants.STATUS.ACTIVE});
      for (const expert of experts) {
        const trading_gain = await this._tradingGainRepository.findOneSort({
          id_expert: expert._id,
        } as ITradingGainModel);
        let result: ITradingOrderModel[] = [];
        if (trading_gain) {
          result = await this._tradingOrderRepository.findWhere({
            id_expert: expert._id,
            status: contants.STATUS.FINISH,
            timeSetup: {
              $gte: new Date(trading_gain.createdAt),
              $lt: date,
            },
          });
        } else {
          result = await this._tradingOrderRepository.findWhere({
            id_expert: expert._id,
            status: contants.STATUS.FINISH,
            timeSetup: {$lt: date},
          });
        }
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
            // total_gain: parseFloat(((profit / expert.base_amount) * 100).toFixed(2)),
            total_gain: profit,
            createdAt: new Date(date),
            updatedAt: new Date(date),
          } as ITradingGainModel);
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
