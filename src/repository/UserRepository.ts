import IUserModel from '@src/models/cpUser/IUserModel';
import UserSchema from '@src/schemas/UserSchema';
import {RepositoryBase} from './base';

export default class UserRepository extends RepositoryBase<IUserModel> {
  constructor() {
    super(UserSchema);
  }

  public async findUserById(id: string): Promise<IUserModel> {
    try {
      const result = await this.findById(id);
      if (result) {
        return result;
      }
      return null;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
