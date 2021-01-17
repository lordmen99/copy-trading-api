import ITradingGainEveryMonthModel from '@src/models/cpTradingGainEveryMonth/ITradingGainEveryMonthModel';
import CPTradingGainEveryMonthSchema from '@src/schemas/CPTradingGainEveryMonthSchema';
import {RepositoryBase} from './base';

export default class TradingGainEveryMonthRepository extends RepositoryBase<ITradingGainEveryMonthModel> {
  constructor() {
    super(CPTradingGainEveryMonthSchema);
  }

  public async insertManyTradingGain(arrTradingGain: ITradingGainEveryMonthModel[]) {
    try {
      const result = await CPTradingGainEveryMonthSchema.insertMany(arrTradingGain);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findOneSort(item: ITradingGainEveryMonthModel) {
    try {
      const result = await CPTradingGainEveryMonthSchema.findOne(item).sort({
        createdAt: -1,
      });
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
