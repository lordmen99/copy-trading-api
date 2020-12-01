import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import IUserModel from '@src/models/cpUser/IUserModel';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants} from '@src/utils';
import {
  CreateTradingCopy,
  GetTradingCopy,
  StopTradingCopy,
} from '@src/validator/trading_copies/trading_copies.validator';
import {validate} from 'class-validator';
import {GetTradingCopyOfUser} from './../validator/trading_copies/trading_copies.validator';

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
          const userBlock = await this._userRepository.findOne({
            _id: tradingCopyEntity.id_user,
          } as IUserModel);
          if (!userBlock) {
            const result = await this._tradingCopyRepository.create(tradingCopyEntity);
            if (result) {
              return result;
            }
            return null;
          } else {
            throw new Error('You are blocked in 24 hours!');
          }
        } else {
          throw new Error('Trading copy is exist!');
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async stopTradingCopy(tradingCopy: StopTradingCopy): Promise<boolean> {
    try {
      const errors = await validate(tradingCopy);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const copy = await this._tradingCopyRepository.findOne({
          _id: tradingCopy.id_copy,
        } as ITradingCopyModel);
        if (copy) {
          const resultUser = await this._userRepository.update(this._userRepository.toObjectId(copy.id_user), {
            blockedAt: new Date(),
            status_trading_copy: contants.STATUS.BLOCK,
          } as IUserModel);
          const resultCopy = await this._tradingCopyRepository.update(copy._id, {
            status: contants.STATUS.STOP,
          } as ITradingCopyModel);
          if (resultUser && resultCopy) {
            return true;
          }
          return false;
        } else {
          throw new Error('Trading copy is not exist!');
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async pauseTradingCopy(tradingCopy: GetTradingCopy): Promise<boolean> {
    try {
      const errors = await validate(tradingCopy);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const copy = await this._tradingCopyRepository.findOne({
          _id: tradingCopy.id_copy,
        } as ITradingCopyModel);
        if (copy) {
          if (copy.status === contants.STATUS.ACTIVE) {
            const resultCopy = await this._tradingCopyRepository.update(copy._id, {
              status: contants.STATUS.PAUSE,
            } as ITradingCopyModel);
            if (resultCopy) {
              return true;
            }
            return false;
          } else {
            throw new Error('Trading copy is not active!');
          }
        } else {
          throw new Error('Trading copy is not exist!');
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async getTradingCopyById(tradingCopy: GetTradingCopy): Promise<ITradingCopyModel> {
    try {
      const errors = await validate(tradingCopy);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const copy = await this._tradingCopyRepository.findOne({
          _id: tradingCopy.id_copy,
        } as ITradingCopyModel);
        if (copy) {
          return copy;
        } else {
          return null;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListTradingCopies(params: GetTradingCopyOfUser, page: number, size: number): Promise<any> {
    try {
      const copy = await this._tradingCopyRepository.findWithPagingById(
        {
          status: contants.STATUS.ACTIVE || contants.STATUS.PAUSE,
          id_user: params.id_user,
        } as ITradingCopyModel,
        parseFloat(page.toString()),
        parseFloat(size.toString()),
      );
      if (copy) {
        return copy;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
}
