import IUserModel from '@src/models/cpUser/IUserModel';
import CPUserSchema from '@src/schemas/CPUserSchema';
import {RepositoryBase} from './base';

export default class UserRepository extends RepositoryBase<IUserModel> {
  constructor() {
    super(CPUserSchema);
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
