import IDataSocketModel from '@src/models/cpDataSocket/IDataSocketModel';
import CPDataSocketSchema from '@src/schemas/CPDataSocketSchema';
import {RepositoryBase} from './base';

export default class DataSocketRepository extends RepositoryBase<IDataSocketModel> {
  constructor() {
    super(CPDataSocketSchema);
  }

  public async findLastDataSocket(): Promise<IDataSocketModel> {
    try {
      const result = await CPDataSocketSchema.findOne({}).sort({
        date: -1,
      });
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async clearDataSocket(date): Promise<void> {
    try {
      await CPDataSocketSchema.deleteMany({
        date: {
          $lt: new Date(new Date().getTime() - 60 * 5 * 1000),
        },
      });
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
