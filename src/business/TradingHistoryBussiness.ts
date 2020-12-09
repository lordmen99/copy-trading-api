import IExpertModel from '@src/models/cpExpert/IExpertModel';
import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import ITradingGainEveryMonthModel from '@src/models/cpTradingGainEveryMonth/ITradingGainEveryMonthModel';
import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingGainEveryMonthRepository from '@src/repository/TradingGainEveryMonthRepository';
import TradingGainRepository from '@src/repository/TradingGainRepository';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
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

  constructor() {
    this._tradingHistoryRepository = new TradingHistoryRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingGainRepository = new TradingGainRepository();
    this._tradingGainEveryMonthRepository = new TradingGainEveryMonthRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
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

  public async getListTradingHistoriesByUser(id_user: Schema.Types.ObjectId, page: number, size: number): Promise<any> {
    try {
      const result = this._tradingHistoryRepository.findWithPagingByUserWithAggregate(
        {id_user} as ITradingHistoryModel,
        page,
        size,
        'id_expert',
        '_id',
        'expert',
        'cp_experts',
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
  ): Promise<any> {
    try {
      const expert = await this._expertRepository.findOneWithSelect({_id: id_expert} as IExpertModel, 'fullname');
      if (expert) {
        const result = await this._tradingHistoryRepository.getListTradingHistoriesFollowExpert(
          {id_expert, id_user: {$ne: null} as any} as ITradingHistoryModel,
          page,
          size,
          'id_user',
          '_id',
          'user',
          'cp_users',
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
  ): Promise<any> {
    try {
      const expert = await this._expertRepository.findOneWithSelect({_id: id_expert} as IExpertModel, 'fullname');
      if (expert) {
        const result = await this._tradingHistoryRepository.findWithPagingById(
          {id_expert, id_user: null} as ITradingHistoryModel,
          page,
          size,
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
      const experts = await this._expertRepository.findWhere({
        status: contants.STATUS.ACTIVE,
      } as IExpertModel);
      for (const expert of experts) {
        const trading_gain_every_month = await this._tradingGainEveryMonthRepository.findOneSort({
          id_expert: expert._id,
        } as ITradingGainEveryMonthModel);
        const trading_gains = await this._tradingGainRepository.findWhere({
          id_expert: expert._id,
          createdAt: {
            $gte: moment(new Date(trading_gain_every_month.createdAt)),
            $lt: moment(date),
          } as any,
        } as ITradingGainModel);

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
            createdAt: new Date(date),
            updatedAt: new Date(date),
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
      }
    } catch (err) {
      throw err;
    }
  }

  public async calculateProfitForExpertEveryDay(date: Date): Promise<void> {
    try {
      const experts = await this._expertRepository.findWhere({
        status: contants.STATUS.ACTIVE,
      } as IExpertModel);
      for (const expert of experts) {
        const trading_gain = await this._tradingGainRepository.findOneSort({
          id_expert: expert._id,
        } as ITradingGainModel);
        if (trading_gain) {
          const result = await this._tradingHistoryRepository.findWhere({
            id_expert: expert._id,
            closing_time: {
              $gte: moment(new Date(trading_gain.createdAt)),
              $lt: moment(date),
            } as any,
          } as ITradingHistoryModel);
          if (result) {
            let profit = 0;
            for (const history of result) {
              if (history.id_user) {
                profit = profit + history.fee_to_expert;
              } else {
                profit = profit + history.profit - history.fee_to_trading;
              }
            }
            await this._tradingGainRepository.create({
              id_expert: expert._id,
              total_gain: parseFloat(((profit / expert.total_amount) * 100).toFixed(2)),
              createdAt: new Date(date),
              updatedAt: new Date(date),
            } as ITradingGainModel);
          }
        } else {
          const result = await this._tradingHistoryRepository.findWhere({
            id_expert: expert._id,
            closing_time: {
              $lt: moment(date),
            } as any,
          } as ITradingHistoryModel);
          if (result) {
            let profit = 0;
            for (const history of result) {
              if (history.id_user) {
                profit = profit + history.fee_to_expert;
              } else {
                profit = profit + history.profit - history.fee_to_trading;
              }
            }
            await this._tradingGainRepository.create({
              id_expert: expert._id,
              total_gain: parseFloat(((profit / expert.total_amount) * 100).toFixed(2)),
              createdAt: new Date(date),
              updatedAt: new Date(date),
            } as ITradingGainModel);
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
