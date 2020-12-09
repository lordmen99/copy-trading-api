import ITradingCopierModel from '@src/models/cpTradingCopier/ITradingCopierModel';
import CPTradingCopierSchema from '@src/schemas/CPTradingCopierSchema';
import {RepositoryBase} from './base';

export default class TradingCopierRepository extends RepositoryBase<ITradingCopierModel> {
  constructor() {
    super(CPTradingCopierSchema);
  }

  public async insertManyTradingCopier(arrTradingCopier: ITradingCopierModel[]) {
    try {
      const result = await CPTradingCopierSchema.insertMany(arrTradingCopier);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
