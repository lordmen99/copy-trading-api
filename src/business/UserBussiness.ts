import IUserModel from '@src/models/cpUser/IUserModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants, security} from '@src/utils';
import {AddUser, EditUser, GetUser} from '@src/validator/users/users.validator';
import {validate} from 'class-validator';

export default class UserBussiness {
  private _userRepository: UserRepository;
  private _expertRepository: ExpertRepository;
  private _tradingCopyRepository: TradingCopyRepository;

  constructor() {
    this._userRepository = new UserRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
  }

  public async findById(params: GetUser): Promise<any> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const result = await this._userRepository.findById(params._id.toString());
        return {
          _id: result._id,
          fullname: result.fullname,
          username: result.username,
          email: result.email,
          phone: result.phone,
          total_amount: result.total_amount,
          status: result.status,
          status_trading_copy: result.status_trading_copy,
          is_virtual: result.is_virtual,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListUsers(): Promise<IUserModel[]> {
    try {
      const result = this._userRepository.findWhere({status: contants.STATUS.ACTIVE} as IUserModel);
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async addUser(user: AddUser): Promise<IUserModel> {
    try {
      const errors = await validate(user);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const securityPass = security.createHashedSalt(user.password);

        const userEntity = user as IUserModel;
        userEntity.hashed_password = securityPass.hashedPassword;
        userEntity.salt = securityPass.salt;

        const result = await this._userRepository.create(userEntity);
        if (result) {
          return result;
        }
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  // public async addUserAndFollowExpert(user: AddUser): Promise<ITradingCopyModel> {
  //   try {
  //     const errors = await validate(user);
  //     if (errors.length > 0) {
  //       throw new Error(Object.values(errors[0].constraints)[0]);
  //     } else {
  //       const tradingCopy = {
  //         id_user: '',
  //         id_expert: '',
  //         investment_amount: 0,
  //         maximum_rate: 0,
  //         stop_loss: 0,
  //         taken_profit: 0,
  //         status: contants.STATUS.ACTIVE,
  //       };
  //       const userEntity = user as IUserModel;

  //       const resultExpert = await this._expertRepository.findWhere({status: contants.STATUS.ACTIVE}
  // as IExpertModel);
  //       const random = Math.floor(Math.random() * resultExpert.length);
  //       const randomInvestment = Math.floor(Math.random() * userEntity.total_amount);
  //       const randomRate = Math.floor(Math.random() * (100 - 1)) + 1;
  //       const randomStopLoss = Math.floor(Math.random() * (100 - 10)) + 10;
  //       const randomProfit = Math.floor(Math.random() * (3000 - 100)) + 100;
  //       const resultUser = await this._userRepository.create(userEntity);

  //       if (resultUser) {
  //         const tradingCopyEntity = tradingCopy as ITradingCopyModel;
  //         tradingCopyEntity.id_user = resultUser._id;
  //         tradingCopyEntity.id_expert = resultExpert[random]._id;
  //         tradingCopyEntity.investment_amount = randomInvestment;
  //         tradingCopyEntity.base_amount = randomInvestment;
  //         tradingCopyEntity.has_maximum_rate = Math.random() < 0.7;
  //         if (tradingCopyEntity.has_maximum_rate) {
  //           tradingCopyEntity.maximum_rate = randomRate;
  //         } else {
  //           tradingCopyEntity.maximum_rate = 0;
  //         }
  //         tradingCopyEntity.has_stop_loss = Math.random() < 0.7;
  //         if (tradingCopyEntity.has_stop_loss) {
  //           tradingCopyEntity.stop_loss = randomStopLoss;
  //         } else {
  //           tradingCopyEntity.stop_loss = 0;
  //         }
  //         tradingCopyEntity.has_taken_profit = Math.random() < 0.7;
  //         if (tradingCopyEntity.has_taken_profit) {
  //           tradingCopyEntity.taken_profit = randomProfit;
  //         } else {
  //           tradingCopyEntity.taken_profit = 0;
  //         }
  //         tradingCopyEntity.createdAt = new Date();
  //         tradingCopyEntity.updatedAt = new Date();

  //         await this._tradingCopyRepository.create(tradingCopyEntity);
  //       }
  //       return null;
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  public async editUser(params: EditUser): Promise<boolean> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const user = await this._userRepository.findById(params._id.toString());
        if (user) {
          const userEntity = user as IUserModel;
          userEntity.fullname = params.fullname;
          userEntity.username = params.username;
          userEntity.email = params.email;
          userEntity.phone = params.phone;
          userEntity.avatar = params.avatar;
          userEntity.total_amount = params.total_amount;
          userEntity.is_virtual = params.is_virtual;

          const result = await this._userRepository.update(params._id, userEntity);

          if (result) {
            return result ? true : false;
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async executeUnblockUser(): Promise<void> {
    try {
      const result = await this._userRepository.findWhere({status: contants.STATUS.BLOCK} as IUserModel);
      if (result) {
        const tempDate = new Date();
        result.map(async (user) => {
          if (
            user.blockedAt.getDate() === tempDate.getDate() &&
            user.blockedAt.getMonth() === tempDate.getMonth() &&
            user.blockedAt.getFullYear() === tempDate.getFullYear() &&
            user.blockedAt.getHours() === tempDate.getHours() &&
            user.blockedAt.getMinutes() === tempDate.getMinutes()
          ) {
            await this._userRepository.update(user._id, {
              status_trading_copy: contants.STATUS.ACTIVE,
            } as IUserModel);
          }
        });
      }
    } catch (err) {
      throw err;
    }
  }
}
