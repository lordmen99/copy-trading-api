import IRealUserModel from '@src/models/cpRealUser/IRealUserModel';
import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import IUserModel from '@src/models/cpUser/IUserModel';
import RealUserRepository from '@src/repository/RealUserRepository';
import TradingWithdrawRepository from '@src/repository/TradingWithdrawRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants} from '@src/utils';
import {CreateTradingWithdraw} from '@src/validator/trading_withdraws/trading_withdraws.validator';
import {validate} from 'class-validator';
import moment from 'moment';

export default class TradingWithdrawBussiness {
  private _tradingWithdrawRepository: TradingWithdrawRepository;
  private _userRepository: UserRepository;
  private _realUserRepository: RealUserRepository;

  constructor() {
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
    this._userRepository = new UserRepository();
    this._realUserRepository = new RealUserRepository();
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

  public async getWalletHistory(id_user, page, size): Promise<any> {
    try {
      const result = await this._tradingWithdrawRepository.getUserWalletHistory(id_user, page, size);
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async getAvailableMoney(id_user, source): Promise<any> {
    try {
      if (source === contants.TYPE_OF_WALLET.WALLET) {
        const user = await this._userRepository.findOne({_id: id_user} as IUserModel);
        if (user) {
          const result = await this._realUserRepository.findOne({_id: user.id_user_trading} as IRealUserModel);
          return parseFloat(result.amount.toString());
        }
      } else if (source === contants.TYPE_OF_WALLET.COPY_TRADE) {
        const result = await this._userRepository.findOne({_id: id_user} as IUserModel);
        if (result) {
          return result.total_amount;
        }
      } else {
        throw new Error('User is not exist');
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListPendingTradingWithdraw(date: Date): Promise<any> {
    try {
      const result = await this._tradingWithdrawRepository.findWhere({
        status: contants.STATUS.PENDING,
        type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER,
        paidAt: {
          $lt: moment(date),
        } as any,
      } as ITradingWithdrawModel);
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async getListPendingWithdraw(date: Date): Promise<any> {
    try {
      const result = await this._tradingWithdrawRepository.findWhere({
        status: contants.STATUS.PENDING,
        type_of_withdraw: contants.TYPE_OF_WITHDRAW.WITHDRAW,
        paidAt: {
          $lt: moment(date),
        } as any,
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
