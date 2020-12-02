import IExpertModel from '@src/models/cpExpert/IExpertModel';
import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import IUserModel from '@src/models/cpUser/IUserModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants} from '@src/utils';
import {AddExpert, EditExpert, GetExpert} from '@src/validator/experts/experts.validator';
import {validate} from 'class-validator';

export default class ExpertBussiness {
  private _expertRepository: ExpertRepository;
  private _tradingCopyRepository: TradingCopyRepository;
  private _userRepository: UserRepository;

  constructor() {
    this._expertRepository = new ExpertRepository();
    this._userRepository = new UserRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
  }

  public async getListExperts(): Promise<IExpertModel[]> {
    try {
      const result = this._expertRepository.findWhere({status: contants.STATUS.ACTIVE} as IExpertModel);
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async addExpert(expert: AddExpert): Promise<IExpertModel> {
    try {
      const errors = await validate(expert);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        // const securityPass = security.createHashedSalt(expert.password);

        const expertEntity = expert as IExpertModel;
        // expertEntity.hashed_password = securityPass.hashedPassword;
        // expertEntity.salt = securityPass.salt;

        const result = await this._expertRepository.create(expertEntity);
        if (result) {
          return result;
        }
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  public async addUserAndFollowExpert(expert: AddExpert): Promise<void> {
    try {
      const errors = await validate(expert);
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
          status: contants.STATUS.ACTIVE,
        };

        const expertEntity = expert as IExpertModel;
        const resultUser = await this._userRepository.findWhere({status: contants.STATUS.ACTIVE} as IUserModel);
        const random = Math.floor(Math.random() * resultUser.length);
        const randomInvestment = Math.floor(Math.random() * (resultUser[random].total_amount - 500) + 500);
        const randomRate = Math.floor(Math.random() * (100 - 1)) + 1;
        const randomStopLoss = Math.floor(Math.random() * (100 - 10)) + 10;
        const randomProfit = Math.floor(Math.random() * (3000 - 100)) + 100;

        const resultExpert = await this._expertRepository.create(expertEntity);

        if (resultExpert) {
          const tradingCopyEntity = tradingCopy as ITradingCopyModel;
          tradingCopyEntity.id_user = resultUser[random]._id;
          tradingCopyEntity.id_expert = resultExpert._id;
          tradingCopyEntity.investment_amount = randomInvestment;
          tradingCopyEntity.base_amount = randomInvestment;
          tradingCopyEntity.has_maximum_rate = Math.random() < 0.7;
          if (tradingCopyEntity.has_maximum_rate) {
            tradingCopyEntity.maximum_rate = randomRate;
          } else {
            tradingCopyEntity.maximum_rate = 0;
          }
          tradingCopyEntity.has_stop_loss = Math.random() < 0.7;
          if (tradingCopyEntity.has_stop_loss) {
            tradingCopyEntity.stop_loss = randomStopLoss;
          } else {
            tradingCopyEntity.stop_loss = 0;
          }
          tradingCopyEntity.has_taken_profit = Math.random() < 0.7;
          if (tradingCopyEntity.has_taken_profit) {
            tradingCopyEntity.taken_profit = randomProfit;
          } else {
            tradingCopyEntity.taken_profit = 0;
          }
          tradingCopyEntity.createdAt = new Date();
          tradingCopyEntity.updatedAt = new Date();

          await this._tradingCopyRepository.create(tradingCopyEntity);
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async editExpert(params: EditExpert): Promise<boolean> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const expert = await this._expertRepository.findById(params._id);
        if (expert) {
          const expertEntity = expert as IExpertModel;
          expertEntity.fullname = params.fullname;
          expertEntity.username = params.username;
          expertEntity.email = params.email;
          expertEntity.phone = params.phone;
          expertEntity.avatar = params.avatar;
          expertEntity.total_amount = params.total_amount;
          expertEntity.is_virtual = params.is_virtual;

          const result = await this._expertRepository.update(
            this._expertRepository.toObjectId(params._id),
            expertEntity,
          );

          if (result) {
            return result ? true : false;
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteExpert(_id: string): Promise<boolean> {
    try {
      const expert = await this._expertRepository.findById(_id);
      if (expert) {
        const expertEntity = expert as IExpertModel;
        expertEntity.status = 'DELETE';

        const result = await this._expertRepository.update(this._expertRepository.toObjectId(_id), expertEntity);

        if (result) {
          return result ? true : false;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async findById(params: GetExpert): Promise<IExpertModel> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._expertRepository.findById(params._id);
      }
    } catch (err) {
      throw err;
    }
  }
}
