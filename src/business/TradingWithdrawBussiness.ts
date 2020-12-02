import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import TradingWithdrawRepository from '@src/repository/TradingWithdrawRepository';
import {contants} from '@src/utils';
import {CreateTradingWithdraw} from '@src/validator/trading_withdraws/trading_withdraws.validator';
import {validate} from 'class-validator';

export default class TradingWithdrawBussiness {
  private _tradingWithdrawRepository: TradingWithdrawRepository;

  constructor() {
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
  }

  // public async getListTradingHistories(page: number, size: number): Promise<any> {
  //   try {
  //     const result = this._tradingHistoryRepository.findWithPaging(page, size);
  //     if (result) {
  //       return result;
  //     }
  //     return [];
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // public async getListTradingHistoriesByUser(id_user: string, page: number, size: number): Promise<any> {
  //   try {
  //     const result = this._tradingHistoryRepository.findWithPagingById({id_user}
  // as ITradingHistoryModel, page, size);
  //     if (result) {
  //       return result;
  //     }
  //     return [];
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // public async getListTradingHistoriesByExpert(id_expert: string, page: number, size: number): Promise<any> {
  //   try {
  //     const result = this._tradingHistoryRepository.findWithPagingById({id_expert}
  // as ITradingHistoryModel, page, size);
  //     if (result) {
  //       return result;
  //     }
  //     return [];
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  public async createTradingWithdraw(tradingWithdraw: CreateTradingWithdraw): Promise<ITradingWithdrawModel> {
    try {
      const errors = await validate(tradingWithdraw);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const tradingWithdrawEntity = tradingWithdraw as ITradingWithdrawModel;
        const result = await this._tradingWithdrawRepository.create(tradingWithdrawEntity);
        if (result) {
          return result;
        }
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListPendingTradingWithdraw(): Promise<any> {
    try {
      const result = this._tradingWithdrawRepository.findWhere({
        status: contants.STATUS.PENDING,
        type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER,
      } as ITradingWithdrawModel);
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }
}
