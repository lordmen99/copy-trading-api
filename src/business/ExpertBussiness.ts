import IExpertModel from '@src/models/cpExpert/IExpertModel';
import ITradingCopierModel from '@src/models/cpTradingCopier/ITradingCopierModel';
import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import ITradingGainEveryMonthModel from '@src/models/cpTradingGainEveryMonth/ITradingGainEveryMonthModel';
import IUserModel from '@src/models/cpUser/IUserModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopierRepository from '@src/repository/TradingCopierRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingGainEveryMonthRepository from '@src/repository/TradingGainEveryMonthRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants, security} from '@src/utils';
import {AddExpert, EditExpert, GetExpert, GetExpertByName} from '@src/validator/experts/experts.validator';
import {validate} from 'class-validator';
import faker from 'faker';
import {Schema} from 'mongoose';

export default class ExpertBussiness {
  private _expertRepository: ExpertRepository;
  private _tradingCopyRepository: TradingCopyRepository;
  private _userRepository: UserRepository;
  private _tradingGainEveryMonthRepository: TradingGainEveryMonthRepository;
  private _tradingCopierRepository: TradingCopierRepository;

  constructor() {
    this._expertRepository = new ExpertRepository();
    this._userRepository = new UserRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
    this._tradingGainEveryMonthRepository = new TradingGainEveryMonthRepository();
    this._tradingCopierRepository = new TradingCopierRepository();
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
      const dataRandomExpert: IExpertModel[] = [];
      for (let i = 0; i < number; i++) {
        const data = {
          fullname: faker.name.findName(),
          username: faker.internet.userName().toLowerCase(),
          email: faker.internet.email().toLowerCase(),
          phone: faker.phone.phoneNumber(),
          avatar: faker.image.avatar(),
          total_amount: parseFloat((Math.random() * (30000 - 10000) + 10000).toFixed(2)),
          is_virtual: true,
          status: contants.STATUS.ACTIVE,
        };
        dataRandomExpert.push(data as IExpertModel);
      }
      if (dataRandomExpert.length > 0) {
        const result = await this._expertRepository.insertManyExxpert(dataRandomExpert);
        const dataRandomTradingGainEveryMonth: ITradingGainEveryMonthModel[] = [];
        const dataRandomTradingCopy: ITradingCopyModel[] = [];
        const dataRandomTradingCopier: ITradingCopierModel[] = [];
        result.map(async (item: IExpertModel) => {
          // render data table profit of expert for 11 recent months
          for (let i = 0; i < 11; i++) {
            dataRandomTradingGainEveryMonth.push({
              id_expert: item._id,
              total_gain: Math.floor(Math.random() * (50 - 1)) + 1,
              createdAt: new Date(new Date().setMonth(new Date().getMonth() - i - 1)),
              updatedAt: new Date(new Date().setMonth(new Date().getMonth() - i - 1)),
            } as ITradingGainEveryMonthModel);
          }

          // render data table Trading copy of expert
          const resultUser = await this._userRepository.findRandomUser();
          if (resultUser.length > 0) {
            resultUser.map((itemUser: IUserModel) => {
              const randomInvestment = Math.floor(Math.random() * (itemUser.total_amount - 500) + 500);
              const randomRate = Math.floor(Math.random() * (50 - 1)) + 1;
              const randomStopLoss = Math.floor(Math.random() * (100 - 10)) + 10;
              const randomProfit = Math.floor(Math.random() * (3000 - 100)) + 100;
              const has_maximum_rate = Math.random() < 0.7;
              const has_stop_loss = Math.random() < 0.7;
              const has_taken_profit = Math.random() < 0.7;
              const userCopyModel = {
                id_user: itemUser._id,
                id_expert: item._id,
                investment_amount: randomInvestment,
                base_amount: randomInvestment,
                has_maximum_rate,
                maximum_rate: has_maximum_rate ? randomRate : 0,
                has_stop_loss,
                stop_loss: has_stop_loss ? randomStopLoss : 0,
                has_taken_profit,
                taken_profit: has_taken_profit ? randomProfit : 0,
                status: contants.STATUS.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              dataRandomTradingCopy.push(userCopyModel as ITradingCopyModel);
            });
          }
          dataRandomTradingCopier.push({
            id_expert: item._id,
            copier: resultUser.length,
            removed_copier: Math.floor(Math.random() * (20 - 1)) + 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as ITradingCopierModel);
        });

        await this._tradingGainEveryMonthRepository.insertManyTradingGain(dataRandomTradingGainEveryMonth);
        await this._tradingCopyRepository.insertManyTradingCopy(dataRandomTradingCopy);
        await this._tradingCopierRepository.insertManyTradingCopier(dataRandomTradingCopier);
      }
      return true;
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

  public async getListExpertsPagingForUser(page, size): Promise<any> {
    try {
      const result = await this._expertRepository.executeListExpertPageForUser(page, size);
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
