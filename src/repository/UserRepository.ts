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

  public async findRandomUser(): Promise<IUserModel[]> {
    try {
      const randomNumber = Math.floor(Math.random() * (30 - 1) + 1);
      const result = await CPUserSchema.aggregate([
        {$sample: {size: randomNumber}},
        {$match: {status: 'ACTIVE', is_virtual: true}},
        {$project: {_id: 1, total_amount: 1}},
      ]);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
