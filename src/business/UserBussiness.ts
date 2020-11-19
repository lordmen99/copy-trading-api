import IUserModel from '@src/models/cpUser/IUserModel';
import UserRepository from '@src/repository/UserRepository';
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
}
