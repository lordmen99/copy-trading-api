import IUserModel from '@src/models/cpUser/IUserModel';
import UserRepository from '@src/repository/UserRepository';
import {AddUser, EditUser} from '@src/validator/users/users.validator';
import {validate} from 'class-validator';

export default class UserBussiness {
  private _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  public async findById(id: string): Promise<IUserModel> {
    try {
      const errors = await validate(id);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._userRepository.findById(id);
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

  public async editUser(params: EditUser): Promise<boolean> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const expert = await this._userRepository.findById(params._id);
        if (expert) {
          const expertEntity = expert as IUserModel;
          expertEntity.fullname = params.fullname;
          expertEntity.username = params.username;
          expertEntity.email = params.email;
          expertEntity.phone = params.phone;
          expertEntity.avatar = params.avatar;
          expertEntity.total_amount = params.total_amount;
          expertEntity.is_virtual = params.is_virtual;

          const result = await this._userRepository.update(this._userRepository.toObjectId(params._id), expertEntity);

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
