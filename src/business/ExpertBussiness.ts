import IExpertModel from '@src/models/cpExpert/IExpertModel';
import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import ITradingGainEveryMonthModel from '@src/models/cpTradingGainEveryMonth/ITradingGainEveryMonthModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingGainEveryMonthRepository from '@src/repository/TradingGainEveryMonthRepository';
import TradingGainRepository from '@src/repository/TradingGainRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants, security} from '@src/utils';
import {
  AddExpert,
  EditExpert,
  GetExpert,
  GetExpertByName,
  UpdateVirtualCopier,
} from '@src/validator/experts/experts.validator';
import {validate} from 'class-validator';
import faker from 'faker';
import {Schema} from 'mongoose';

export default class ExpertBussiness {
  private _expertRepository: ExpertRepository;
  private _tradingCopyRepository: TradingCopyRepository;
  private _userRepository: UserRepository;
  private _tradingGainEveryMonthRepository: TradingGainEveryMonthRepository;
  private _tradingGainRepository: TradingGainRepository;

  constructor() {
    this._expertRepository = new ExpertRepository();
    this._userRepository = new UserRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
    this._tradingGainEveryMonthRepository = new TradingGainEveryMonthRepository();
    this._tradingGainRepository = new TradingGainRepository();
  }

  public async getListExperts(): Promise<IExpertModel[]> {
    try {
      const result = this._expertRepository.findWhere({status: contants.STATUS.ACTIVE});
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
        const total_amount = parseInt((Math.random() * (30000 - 10000) + 10000).toString());
        const data = {
          fullname: faker.name.findName(),
          username: faker.internet.userName().toLowerCase(),
          email: faker.internet.email().toLowerCase(),
          phone: faker.phone.phoneNumber(),
          avatar: faker.image.avatar(),
          total_amount,
          base_amount: total_amount,
          is_virtual: true,
          status: contants.STATUS.ACTIVE,
          auto_gen_copier: false,
        };
        dataRandomExpert.push(data as IExpertModel);
      }
      if (dataRandomExpert.length > 0) {
        const result = await this._expertRepository.insertManyExpert(dataRandomExpert);
        const dataRandomTradingGainEveryMonth: ITradingGainEveryMonthModel[] = [];
        const dataRandomTradingGain: ITradingGainModel[] = [];
        const dataRandomTradingCopy: ITradingCopyModel[] = [];
        if (result.length <= 0) return true;
        result.map((item: IExpertModel) => {
          dataRandomTradingGainEveryMonth.push({
            id_expert: item._id,
            total_gain: 0,
            copier: 0,
            removed_copier: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as ITradingGainEveryMonthModel);
          for (let i = 0; i < 7; i++) {
            dataRandomTradingGain.push({
              id_expert: item._id,
              total_gain: Math.floor(Math.random() * (20 - 1)) + 1,
              createdAt: new Date(new Date().setDate(new Date().getDate() - i - 1)),
              updatedAt: new Date(new Date().setDate(new Date().getDate() - i - 1)),
            } as ITradingGainModel);
          }
        });
        await this._tradingCopyRepository.insertManyTradingCopy(dataRandomTradingCopy);
        await this._tradingGainEveryMonthRepository.insertManyTradingGain(dataRandomTradingGainEveryMonth);
        await this._tradingGainRepository.insertManyTradingGain(dataRandomTradingGain);
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
          const expertEntity = expert;
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

  public async updateVirtualCopier(params: UpdateVirtualCopier): Promise<boolean> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const expert = await this._expertRepository.findById(params.id_expert.toString());
        if (expert) {
          const expertEntity = expert;
          expertEntity.virtual_copier = params.number;
          const result = await this._expertRepository.update(params.id_expert, expertEntity);
          if (result) {
            return result ? true : false;
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async updateRangeAutoCopier(
    id_expert,
    from_copier: number,
    to_copier: number,
    auto_gen_copier: boolean,
  ): Promise<boolean> {
    try {
      const expert = await this._expertRepository.findById(id_expert.toString());
      if (expert) {
        const expertEntity = expert;
        expertEntity.from_copier = from_copier;
        expertEntity.to_copier = to_copier;
        expertEntity.auto_gen_copier = auto_gen_copier;
        const result = await this._expertRepository.update(id_expert.toString(), expertEntity);
        if (result) {
          return result ? true : false;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async enableAutoCopier(id_expert, auto_gen_copier: boolean): Promise<boolean> {
    try {
      const expert = await this._expertRepository.findById(id_expert.toString());
      if (expert) {
        const expertEntity = expert;
        expertEntity.auto_gen_copier = auto_gen_copier;
        const result = await this._expertRepository.update(id_expert.toString(), expertEntity);
        if (result) {
          return result ? true : false;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListExpertAutoCopier(): Promise<IExpertModel[]> {
    try {
      const experts = await this._expertRepository.findWhere({
        auto_gen_copier: true,
        status: contants.STATUS.ACTIVE,
      });
      if (experts) {
        return experts;
      } else {
        return [];
      }
    } catch (err) {
      throw err;
    }
  }

  public async autoGenCopier(expert: IExpertModel): Promise<void> {
    try {
      const result = await this._expertRepository.findById(expert._id.toString());
      if (result) {
        const auto_gen_copier =
          Math.floor(Math.random() * (expert.to_copier - expert.from_copier)) + expert.from_copier;
        await this._expertRepository.update(expert._id, {
          virtual_copier: expert.virtual_copier + auto_gen_copier,
        });
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteExpert(_id: Schema.Types.ObjectId): Promise<boolean> {
    try {
      const expert = await this._expertRepository.findById(_id.toString());
      if (expert) {
        const expertEntity = expert;
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

  public async findByName(params: GetExpertByName, page: number, size: number): Promise<IExpertModel[]> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._expertRepository.searchByUserName(params, page, size);
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByNameAdmin(params: GetExpertByName, page: number, size: number): Promise<IExpertModel[]> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._expertRepository.searchByUserName(params, page, size);
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListExpertsPaging(username, page, size): Promise<any> {
    try {
      const result = await this._expertRepository.executeListExpertPage(username, page, size);
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

  public async getProfitForExpert(
    id_expert: Schema.Types.ObjectId,
    fromDate: Date,
    toDate: Date,
    type: string,
  ): Promise<any> {
    try {
      if (type === contants.TYPE_OF_TIME.MONTH) {
        const result = await this._tradingGainEveryMonthRepository.findWhere({
          id_expert,
          createdAt: {
            $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
            $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
          },
        });
        if (result) {
          return result;
        } else return null;
      } else if (type === contants.TYPE_OF_TIME.DAY) {
        const result = await this._tradingGainRepository.findWhere({
          id_expert,
          createdAt: {
            $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
            $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
          },
        });
        if (result) {
          return result;
        } else return null;
      } else {
        throw new Error('Type is not valid');
      }
    } catch (err) {
      throw err;
    }
  }
}