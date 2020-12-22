import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import CPTradingOrderSchema from '@src/schemas/CPTradingOrderSchema';
import {RepositoryBase} from './base';

export default class TradingOrderRepository extends RepositoryBase<ITradingOrderModel> {
  constructor() {
    super(CPTradingOrderSchema);
  }

  public async getListOrders(
    status: string,
    page: number,
    size: number,
    fromDate: Date,
    toDate: Date,
    action: string,
  ): Promise<any> {
    try {
      const result = await CPTradingOrderSchema.find({
        status: {$regex: '.*' + status + '.*'},
        createdAt: {
          $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
          $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
        },
        type_of_order: {$regex: '.*' + action + '.*'},
      })
        .limit(parseInt(size.toString()))
        .skip((parseInt(page.toString()) - 1) * parseInt(size.toString()));
      const count = await CPTradingOrderSchema.countDocuments({
        status: {$regex: '.*' + status + '.*'},
        createdAt: {
          $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
          $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
        },
        type_of_order: {$regex: '.*' + action + '.*'},
      });
      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async getListOrdersByExpert(
    id_expert,
    status: string,
    page: number,
    size: number,
    fromDate: Date,
    toDate: Date,
    action: string,
  ): Promise<any> {
    try {
      const result = await CPTradingOrderSchema.find({
        id_expert,
        status: {$regex: '.*' + status + '.*'},
        createdAt: {
          $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
          $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
        },
        type_of_order: {$regex: '.*' + action + '.*'},
      })
        .limit(parseInt(size.toString()))
        .skip((parseInt(page.toString()) - 1) * parseInt(size.toString()));
      const count = await CPTradingOrderSchema.countDocuments({
        id_expert,
        status: {$regex: '.*' + status + '.*'},
        createdAt: {
          $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
          $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
        },
        type_of_order: {$regex: '.*' + action + '.*'},
      });
      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
