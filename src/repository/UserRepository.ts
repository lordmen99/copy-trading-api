import IUserModel from '@src/models/cpUser/IUserModel';
import CPUserSchema from '@src/schemas/CPUserSchema';
import {contants} from '@src/utils';
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

  public async findRandomUser(): Promise<IUserModel[]> {
    try {
      const result = await CPUserSchema.find({
        status: contants.STATUS.ACTIVE,
        is_virtual: true,
      })
        .limit(Math.floor(Math.random() * (30 - 10)) + 10)
        .skip(Math.floor(Math.random() * (30 - 10)) + 10);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
