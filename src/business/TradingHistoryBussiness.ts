import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import {CreateTradingHistory} from '@src/validator/trading_histories/trading_histories.validator';
import {validate} from 'class-validator';

export default class TradingHistoryBussiness {
  private _tradingHistoryRepository: TradingHistoryRepository;

  constructor() {
    this._tradingHistoryRepository = new TradingHistoryRepository();
  }

  public async getListTradingHistories(page: number, size: number): Promise<ITradingHistoryModel[]> {
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
