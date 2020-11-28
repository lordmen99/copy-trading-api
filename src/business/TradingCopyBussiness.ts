import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import {contants} from '@src/utils';
import {CreateTradingCopy} from '@src/validator/trading_copies/trading_copies.validator';
import {validate} from 'class-validator';

export default class TradingCopyBussiness {
  private _tradingCopyRepository: TradingCopyRepository;

  constructor() {
    this._tradingCopyRepository = new TradingCopyRepository();
  }

  public async findById(id: string): Promise<ITradingCopyModel> {
    try {
      const errors = await validate(id);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._tradingCopyRepository.findById(id);
      }
    } catch (err) {
      throw err;
    }
  }

  public async getTradingCopies(id_expert: string): Promise<ITradingCopyModel[]> {
    try {
      const result = this._tradingCopyRepository.findWhere({
        status: contants.STATUS.ACTIVE,
        id_expert,
      } as ITradingCopyModel);
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async createTradingCopy(tradingCopy: CreateTradingCopy): Promise<ITradingCopyModel> {
    try {
      const errors = await validate(tradingCopy);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const tradingCopyEntity = tradingCopy as ITradingCopyModel;
        const result = await this._tradingCopyRepository.create(tradingCopyEntity);
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
