import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import IUserModel from '@src/models/cpUser/IUserModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import UserRepository from '@src/repository/UserRepository';
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

  public async findById(params: GetUser): Promise<IUserModel> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._userRepository.findById(params._id);
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListUsers(): Promise<IUserModel[]> {
    try {
      const result = this._userRepository.findWhere('ACTIVE');
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
        // const securityPass = security.createHashedSalt(user.password);

        const userEntity = user as IUserModel;
        // userEntity.hashed_password = securityPass.hashedPassword;
        // userEntity.salt = securityPass.salt;

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

  public async addUserAndFollowExpert(user: AddUser): Promise<ITradingCopyModel> {
    try {
      const errors = await validate(user);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const tradingCopy = {
          id_user: '',
          id_expert: '',
          investment_amount: 0,
          maximum_rate: 0,
          stop_loss: 0,
          taken_profit: 0,
          status: 'ACTIVE',
        };
        const userEntity = user as IUserModel;

        const resultExpert = await this._expertRepository.findWhere('ACTIVE');
        const random = Math.floor(Math.random() * resultExpert.length);
        const randomInvestment = Math.floor(Math.random() * userEntity.total_amount);
        const randomRate = Math.floor(Math.random() * 30) + 1;
        const randomStopLoss = Math.floor(Math.random() * 50) + 1;
        const randomProfit = Math.floor(Math.random() * 1000) + 100;
        const resultUser = await this._userRepository.create(userEntity);

        if (resultUser) {
          const tradingCopyEntity = tradingCopy as ITradingCopyModel;
          tradingCopyEntity.id_user = resultUser._id.toHexString();
          tradingCopyEntity.id_expert = resultExpert[random]._id;
          tradingCopyEntity.investment_amount = randomInvestment;
          tradingCopyEntity.maximum_rate = randomRate;
          tradingCopyEntity.stop_loss = randomStopLoss;
          tradingCopyEntity.taken_profit = randomProfit;
          const resultTradingCopy = await this._tradingCopyRepository.create(tradingCopyEntity).catch((err) => {
            throw err;
          });
        }
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  public async editUser(params: EditUser): Promise<boolean> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const user = await this._userRepository.findById(params._id);
        if (user) {
          const userEntity = user as IUserModel;
          userEntity.fullname = params.fullname;
          userEntity.username = params.username;
          userEntity.email = params.email;
          userEntity.phone = params.phone;
          userEntity.avatar = params.avatar;
          userEntity.total_amount = params.total_amount;
          userEntity.is_virtual = params.is_virtual;

          const result = await this._userRepository.update(this._userRepository.toObjectId(params._id), userEntity);

          if (result) {
            return result ? true : false;
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
