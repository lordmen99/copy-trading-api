import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import CPTradingGainSchema from '@src/schemas/CPTradingGainSchema';
import {RepositoryBase} from './base';

export default class TradingGainRepository extends RepositoryBase<ITradingGainModel> {
  constructor() {
    super(CPTradingGainSchema);
  }

  public async insertManyTradingGain(arrTradingGain: ITradingGainModel[]) {
    try {
      const result = await CPTradingGainSchema.insertMany(arrTradingGain);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findOneSort(item: ITradingGainModel) {
    try {
      const result = await CPTradingGainSchema.findOne(item).sort({
        createdAt: -1,
      });
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
