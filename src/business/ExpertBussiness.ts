import IExpertModel from '@src/models/cpExpert/IExpertModel';
import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import IUserModel from '@src/models/cpUser/IUserModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingGainRepository from '@src/repository/TradingGainRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants, security} from '@src/utils';
import {AddExpert, EditExpert, GetExpert, GetExpertByName} from '@src/validator/experts/experts.validator';
import {validate} from 'class-validator';
import {Schema} from 'mongoose';

export default class ExpertBussiness {
  private _expertRepository: ExpertRepository;
  private _tradingCopyRepository: TradingCopyRepository;
  private _userRepository: UserRepository;
  private _tradingGainRepository: TradingGainRepository;

  constructor() {
    this._expertRepository = new ExpertRepository();
    this._userRepository = new UserRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
    this._tradingGainRepository = new TradingGainRepository();
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
        const securityPass = security.createHashedSalt(expert.password);

        const expertEntity = expert as IExpertModel;
        expertEntity.hashed_password = securityPass.hashedPassword;
        expertEntity.salt = securityPass.salt;

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

  public async addUserAndFollowExpert(number: number): Promise<any> {
    try {
      const faker = require('faker');
      const resultUser = await this._userRepository.findWhere({
        status: contants.STATUS.ACTIVE,
        is_virtual: true,
      } as IUserModel);
      if (resultUser.length === 0) {
        throw new Error('System does not have any fake users');
      } else {
        for (let i = 0; i < number; i++) {
          // tạo expert
          const fullname = faker.name.findName();
          const username = faker.internet.userName().toLowerCase();
          const email = faker.internet.email().toLowerCase();
          const phone = faker.phone.phoneNumber();
          const total_amount = parseFloat((Math.random() * (30000 - 10000) + 10000).toFixed(2));

          const data = new AddExpert();

          data.fullname = fullname;
          data.username = username;
          data.email = email;
          data.phone = phone;
          data.avatar = '';
          data.total_amount = total_amount;
          data.is_virtual = true;
          data.status = contants.STATUS.ACTIVE;
          const expertEntity = data as IExpertModel;
          const resultExpert = await this._expertRepository.create(expertEntity);

          // tạo bảng profit cho expert
          await this._tradingGainRepository.create({
            id_expert: resultExpert._id,
            gain_last_month: Math.floor(Math.random() * (10 - 1)) + 1,
            total_gain: Math.floor(Math.random() * (1000 - 100)) + 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as ITradingGainModel);

          const tradingCopy = {
            id_user: null,
            id_expert: null,
            investment_amount: 0,
            maximum_rate: 0,
            stop_loss: 0,
            taken_profit: 0,
            status: contants.STATUS.ACTIVE,
          };

          // random ra một số user copy expert
          for (let i = 0; i < Math.floor(Math.random() * (30 - 10)) + 10; i++) {
            const random = Math.floor(Math.random() * resultUser.length);
            const randomInvestment = Math.floor(Math.random() * (resultUser[random].total_amount - 500) + 500);
            const randomRate = Math.floor(Math.random() * (50 - 1)) + 1;
            const randomStopLoss = Math.floor(Math.random() * (100 - 10)) + 10;
            const randomProfit = Math.floor(Math.random() * (3000 - 100)) + 100;

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
        }
        return true;
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
        const expert = await this._expertRepository.findById(params._id.toString());
        if (expert) {
          const expertEntity = expert as IExpertModel;
          expertEntity.fullname = params.fullname;
          expertEntity.username = params.username;
          expertEntity.email = params.email;
          expertEntity.phone = params.phone;
          expertEntity.avatar = params.avatar;
          expertEntity.total_amount = params.total_amount;
          expertEntity.is_virtual = params.is_virtual;

          const result = await this._expertRepository.update(params._id, expertEntity);

          if (result) {
            return result ? true : false;
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteExpert(_id: Schema.Types.ObjectId): Promise<boolean> {
    try {
      const expert = await this._expertRepository.findById(_id.toString());
      if (expert) {
        const expertEntity = expert as IExpertModel;
        expertEntity.status = 'DELETE';

        const result = await this._expertRepository.update(_id, expertEntity);

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
        return this._expertRepository.findById(params._id.toString());
      }
    } catch (err) {
      throw err;
    }
  }

  public async getExpertDetails(params: GetExpert): Promise<any> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const result = await this._expertRepository.getExpertDetails({_id: params._id} as any);
        return result;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByName(params: GetExpertByName): Promise<IExpertModel[]> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._expertRepository.findWhere({fullname: {$regex: '.*' + params.fullname + '.*'}} as any);
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListExpertsPaging(page, size): Promise<any> {
    try {
      const result = await this._expertRepository.executeListExpertPage(page, size);
      if (result) {
        return result;
      } else {
        return [];
      }
    } catch (err) {
      throw err;
    }
  }

  public async findUserCopyByExpert(id_expert: Schema.Types.ObjectId, page: number, size: number): Promise<any> {
    try {
      const result = await this._expertRepository.getUserCopyByExpert({_id: id_expert} as IExpertModel, page, size);
      if (result) {
        return result.user;
      }
    } catch (err) {
      throw err;
    }
  }
}
