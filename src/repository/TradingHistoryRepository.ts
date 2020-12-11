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
    fromDate: Date,
    toDate: Date,
  ): Promise<any> {
    try {
      const result = await CPTradingHistorySchema.aggregate([
        {
          $match: {
            id_user: new mongoose.Types.ObjectId(item.id_user),
            closing_time: {
              $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
              $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
            },
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
                    username: 1,
                  },
                },
              },
            ],
          },
        },
        {$project: {data: '$data'}},
      ]);

      const count = await CPTradingHistorySchema.countDocuments(item);

      const profit = await CPTradingHistorySchema.aggregate([
        {
          $match: {
            id_user: new mongoose.Types.ObjectId(item.id_user),
            closing_time: {
              $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
              $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
            },
          },
        },
        {
          $group: {
            _id: null,
            profit: {$sum: '$profit'},
            fee_to_trading: {$sum: '$fee_to_trading'},
            fee_to_expert: {$sum: '$fee_to_expert'},
          },
        },
      ]);

      return {
        result,
        count,
        profit,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async getListTradingHistoriesFollowExpert(
    item: any,
    page: number,
    size: number,
    localField: string,
    foreignField: string,
    as: string,
    from: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<any> {
    try {
      const result = await CPTradingHistorySchema.aggregate([
        {
          $match: {
            id_expert: new mongoose.Types.ObjectId(item.id_expert),
            id_user: {$ne: null},
            closing_time: {
              $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
              $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
            },
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
                  user: {
                    username: 1,
                  },
                },
              },
            ],
          },
        },
        {$project: {data: '$data'}},
      ]);
      const profit = await CPTradingHistorySchema.aggregate([
        {
          $match: {
            id_expert: new mongoose.Types.ObjectId(item.id_expert),
            id_user: {$ne: null},
            closing_time: {
              $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
              $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
            },
          },
        },
        {
          $group: {
            _id: null,
            profit: {$sum: '$profit'},
            fee_to_trading: {$sum: '$fee_to_trading'},
            fee_to_expert: {$sum: '$fee_to_expert'},
          },
        },
      ]);

      const count = await CPTradingHistorySchema.countDocuments({
        id_expert: item.id_expert,
        id_user: {$ne: null},
        closing_time: {
          $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
          $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
        },
      });

      return {
        result,
        count,
        profit,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async getListTradingHistoriesByExpert(
    item: any,
    page: number,
    size: number,
    fromDate: Date,
    toDate: Date,
  ): Promise<any> {
    try {
      const result = await CPTradingHistorySchema.aggregate([
        {
          $match: {
            id_expert: new mongoose.Types.ObjectId(item.id_expert),
            id_user: null,
            closing_time: {
              $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
              $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
            },
          },
        },
        {
          $facet: {
            data: [
              {$skip: (parseInt(page.toString()) - 1) * parseInt(size.toString())},
              {$limit: parseInt(size.toString())},
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
                },
              },
            ],
          },
        },
        {$project: {data: '$data'}},
      ]);
      const profit = await CPTradingHistorySchema.aggregate([
        {
          $match: {
            id_expert: new mongoose.Types.ObjectId(item.id_expert),
            id_user: null,
            closing_time: {
              $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
              $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
            },
          },
        },
        {
          $group: {
            _id: null,
            profit: {$sum: '$profit'},
            fee_to_trading: {$sum: '$fee_to_trading'},
            fee_to_expert: {$sum: '$fee_to_expert'},
          },
        },
      ]);

      const count = await CPTradingHistorySchema.countDocuments({
        id_expert: item.id_expert,
        id_user: null,
        closing_time: {
          $gte: new Date(new Date(fromDate).setHours(0, 0, 0)),
          $lt: new Date(new Date(toDate).setHours(23, 59, 59)),
        },
      });

      return {
        result,
        count,
        profit,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async insertManyTradingHistory(arrTradingHistory: ITradingHistoryModel[]) {
    try {
      const result = await CPTradingHistorySchema.insertMany(arrTradingHistory);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
