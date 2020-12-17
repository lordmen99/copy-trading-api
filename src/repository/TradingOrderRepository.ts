import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import CPTradingOrderSchema from '@src/schemas/CPTradingOrderSchema';
import {RepositoryBase} from './base';

export default class TradingOrderRepository extends RepositoryBase<ITradingOrderModel> {
  constructor() {
    super(CPTradingOrderSchema);
  }

  public async getListOrders(status: string, page: number, size: number, fromDate: Date, toDate: Date): Promise<any> {
    try {
      const result = await CPTradingOrderSchema.find({
        status: {$regex: '.*' + status + '.*'} as any,
        createdAt: {
          $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
          $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
        },
      })
        .limit(parseInt(size.toString()))
        .skip((parseInt(page.toString()) - 1) * parseInt(size.toString()));
      const count = await CPTradingOrderSchema.countDocuments({});
      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
