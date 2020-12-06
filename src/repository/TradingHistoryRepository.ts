import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import CPTradingHistorySchema from '@src/schemas/CPTradingHistorySchema';
import mongoose from 'mongoose';
import {RepositoryBase} from './base';

export default class TradingHistoryRepository extends RepositoryBase<ITradingHistoryModel> {
  constructor() {
    super(CPTradingHistorySchema);
  }

  public async findWithPagingByUserWithAggregate(
    item: any,
    page: number,
    size: number,
    localField: string,
    foreignField: string,
    as: string,
    from: string,
  ): Promise<any> {
    try {
      const result = await CPTradingHistorySchema.aggregate([
        {
          $match: {
            id_user: new mongoose.Types.ObjectId(item.id_user),
          },
        },
        {
          $facet: {
            data: [
              {$skip: (parseInt(page.toString()) - 1) * parseInt(size.toString())},
              {$limit: parseInt(size.toString())},
              {
                $lookup: {
                  from,
                  localField,
                  foreignField,
                  as,
                },
              },
              {
                $project: {
                  _id: 1,
                  status: 1,
                  id_user: 1,
                  id_expert: 1,
                  opening_time: 1,
                  type_of_order: 1,
                  opening_price: 1,
                  closing_time: 1,
                  closing_price: 1,
                  investment_amount: 1,
                  order_amount: 1,
                  profit: 1,
                  fee_to_expert: 1,
                  fee_to_trading: 1,
                  type_of_money: 1,
                  expert: {
                    fullname: 1,
                  },
                },
              },
            ],
          },
        },
        {$project: {data: '$data'}},
      ]);

      const count = await CPTradingHistorySchema.countDocuments(item);

      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
