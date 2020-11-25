import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import {validate} from 'class-validator';

export default class TradingHistoryBussiness {
  private _tradingHistoryRepository: TradingHistoryRepository;

  constructor() {
    this._tradingHistoryRepository = new TradingHistoryRepository();
  }

  public async findById(id: string): Promise<ITradingHistoryModel> {
    try {
      const errors = await validate(id);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._tradingHistoryRepository.findById(id);
      }
    } catch (err) {
      throw err;
    }
  }
}
