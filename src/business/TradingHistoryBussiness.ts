import IExpertModel from '@src/models/cpExpert/IExpertModel';
import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import {CreateTradingHistory} from '@src/validator/trading_histories/trading_histories.validator';
import {validate} from 'class-validator';
import {Schema} from 'mongoose';

export default class TradingHistoryBussiness {
  private _tradingHistoryRepository: TradingHistoryRepository;
  private _expertRepository: ExpertRepository;

  constructor() {
    this._tradingHistoryRepository = new TradingHistoryRepository();
    this._expertRepository = new ExpertRepository();
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
      const result = this._tradingHistoryRepository.findWithPagingByIdWithAggregate(
        {id_user} as ITradingHistoryModel,
        page,
        size,
      );
      if (result) {
        return result;
      }
      return [];
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
          {id_expert} as ITradingHistoryModel,
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
}
