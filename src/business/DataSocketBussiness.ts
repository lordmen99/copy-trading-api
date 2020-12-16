import IDataSocketModel from '@src/models/cpDataSocket/IDataSocketModel';
import DataSocketRepository from '@src/repository/DataSocketRepository';

export default class TradingWithdrawBussiness {
  private _dataSocketRepository: DataSocketRepository;

  constructor() {
    this._dataSocketRepository = new DataSocketRepository();
  }

  public async getListDataSocket(): Promise<IDataSocketModel> {
    try {
      const result = await this._dataSocketRepository.findLastDataSocket();
      if (result) {
        return result;
      }
      return null;
    } catch (err) {
      throw err;
    }
  }

  public async clearDataSocket(date): Promise<void> {
    try {
      await this._dataSocketRepository.clearDataSocket(date);
    } catch (err) {
      throw err;
    }
  }
}
