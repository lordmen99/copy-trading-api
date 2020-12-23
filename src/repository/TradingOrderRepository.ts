import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import CPTradingOrderSchema from '@src/schemas/CPTradingOrderSchema';
import mongoose from 'mongoose';
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
      const win = await CPTradingOrderSchema.aggregate([
        {
          $match: {
            type_of_order: 'WIN',
            id_expert: new mongoose.Types.ObjectId(id_expert),
            status: {$regex: '.*' + status + '.*'},
            createdAt: {
              $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
              $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
            },
          },
        },
        {
          $group: {
            _id: null,
            win: {$sum: '$threshold_percent'},
          },
        },
      ]);
      const lose = await CPTradingOrderSchema.aggregate([
        {
          $match: {
            type_of_order: 'LOSE',
            id_expert: new mongoose.Types.ObjectId(id_expert),
            status: {$regex: '.*' + status + '.*'},
            createdAt: {
              $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
              $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
            },
          },
        },
        {
          $group: {
            _id: null,
            lose: {$sum: '$threshold_percent'},
          },
        },
      ]);

      const diff = {
        win: 0,
        lose: 0,
      };
      if (win.length > 0) {
        if (action === 'LOSE') {
          diff.win = 0;
        } else diff.win = win[0].win;
      }
      if (lose.length > 0) {
        if (action === 'WIN') {
          diff.lose = 0;
        } else diff.lose = lose[0].lose;
      }

      return {
        result,
        count,
        diff,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
