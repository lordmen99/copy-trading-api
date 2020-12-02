import IExpertModel from '@src/models/cpExpert/IExpertModel';
import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import IUserModel from '@src/models/cpUser/IUserModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingWithdrawRepository from '@src/repository/TradingWithdrawRepository';
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
  private _expertRepository: ExpertRepository;
  private _tradingWithdrawRepository: TradingWithdrawRepository;

  constructor() {
    this._tradingCopyRepository = new TradingCopyRepository();
    this._userRepository = new UserRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
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
            status_trading_copy: contants.STATUS.BLOCK,
          } as IUserModel);
          if (!userBlock) {
            const result = await this._tradingCopyRepository.create(tradingCopyEntity);
            if (result) {
              const user = await this._userRepository.findOne({
                _id: tradingCopyEntity.id_user,
              } as IUserModel);
              const updateUser = await this._userRepository.update(
                this._userRepository.toObjectId(tradingCopyEntity.id_user),
                {
                  total_amount: user.total_amount - tradingCopyEntity.base_amount,
                } as IUserModel,
              );
              if (updateUser) {
                return result;
              }
              return null;
            }
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
            blockedAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
            status_trading_copy: contants.STATUS.BLOCK,
            total_amount: copy.investment_amount > copy.base_amount ? copy.base_amount : copy.investment_amount,
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

  public async resumeTradingCopy(tradingCopy: GetTradingCopy): Promise<boolean> {
    try {
      const errors = await validate(tradingCopy);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const copy = await this._tradingCopyRepository.findOne({
          _id: tradingCopy.id_copy,
        } as ITradingCopyModel);
        if (copy) {
          if (copy.status === contants.STATUS.PAUSE) {
            const resultCopy = await this._tradingCopyRepository.update(copy._id, {
              status: contants.STATUS.ACTIVE,
            } as ITradingCopyModel);
            if (resultCopy) {
              return true;
            }
            return false;
          } else {
            throw new Error('Trading copy is not pause!');
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

  public async calculateMoney(id: string, type: string, money: number): Promise<void> {
    try {
      if (type === 'user') {
        const userCopy = await this._tradingCopyRepository.findOne({
          id_user: id,
        } as ITradingCopyModel);
        const result = await this._tradingCopyRepository.update(userCopy._id, {
          investment_amount: userCopy.investment_amount + money,
        } as ITradingCopyModel);
      } else {
        const expert = await this._expertRepository.findOne({
          _id: id,
        } as IExpertModel);
        await this._expertRepository.update(this._expertRepository.toObjectId(id), {
          total_amount: expert.total_amount + money,
        } as IExpertModel);
      }
    } catch (err) {
      throw err;
    }
  }

  public async transferMoneyToExpert(withdraw: ITradingWithdrawModel): Promise<void> {
    try {
      const userCopy = await this._tradingCopyRepository.findOne({
        id_user: withdraw.id_user,
      } as ITradingCopyModel);
      await this._tradingCopyRepository.update(userCopy._id, {
        investment_amount: userCopy.investment_amount - withdraw.amount,
      } as ITradingCopyModel);
      const expert = await this._expertRepository.findOne({
        _id: withdraw.id_expert,
      } as IExpertModel);
      await this._expertRepository.update(expert._id, {
        total_amount: expert.total_amount + withdraw.amount,
      } as IExpertModel);
      await this._tradingWithdrawRepository.update(withdraw._id, {
        status: contants.STATUS.FINISH,
        updatedAt: new Date(),
      } as ITradingWithdrawModel);
    } catch (err) {
      throw err;
    }
  }
}
