import IExpertModel from '@src/models/cpExpert/IExpertModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import {contants} from '@src/utils';
import {AddExpert, EditExpert, GetExpert} from '@src/validator/experts/experts.validator';
import {validate} from 'class-validator';

export default class ExpertBussiness {
  private _expertRepository: ExpertRepository;

  constructor() {
    this._expertRepository = new ExpertRepository();
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
