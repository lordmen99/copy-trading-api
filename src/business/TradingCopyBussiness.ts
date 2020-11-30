import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants} from '@src/utils';
import {CreateTradingCopy} from '@src/validator/trading_copies/trading_copies.validator';
import {validate} from 'class-validator';

export default class TradingCopyBussiness {
  private _tradingCopyRepository: TradingCopyRepository;
  private _userRepository: UserRepository;

  constructor() {
    this._tradingCopyRepository = new TradingCopyRepository();
    this._userRepository = new UserRepository();
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

  public async updateById(id: string): Promise<ITradingCopyModel> {
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

  public async findUserCopyByExpert(id_expert: string): Promise<ITradingCopyModel[]> {
    // const listUsers = [];

    // try {
    //   // const result = await this._tradingCopyRepository.findWhereInner({
    //   //   status: contants.STATUS.ACTIVE,
    //   //   id_expert,
    //   // } as ITradingCopyModel);
    //   // if (result) {
    //   //   await result.map(async (item) => {
    //   //     this._userRepository.findUserById(item.id_user).then((user) => {
    //   //       listUsers.push(user.toObject());
    //   //       return listUsers;
    //   //     });
    //   //   });
    //   // } else {
    //   //   return [];
    //   // }
    //   if (result) {
    //     return result;
    //   }
    return [];
    // } catch (err) {
    //   throw err;
    // }
  }

  public async getTradingCopies(id_expert: string): Promise<ITradingCopyModel[]> {
    try {
      const result = await this._tradingCopyRepository.findWhere({
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
        const duplicateResult = await this._tradingCopyRepository.findOne({
          id_expert: tradingCopyEntity.id_expert,
          id_user: tradingCopyEntity.id_user,
        } as ITradingCopyModel);
        if (!duplicateResult) {
          const result = await this._tradingCopyRepository.create(tradingCopyEntity);
          if (result) {
            return result;
          }
        } else {
          throw new Error('Trading copy is exist!');
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
