import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';

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
}
