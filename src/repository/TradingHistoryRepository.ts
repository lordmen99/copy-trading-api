import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import CPTradingHistorySchema from '@src/schemas/CPTradingHistorySchema';
import mongoose, {Schema} from 'mongoose';
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
          $sort: {closing_time: -1},
        },
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

      if (result.length > 0) {
        if (result[0].data.length > 0)
          for (const history of result[0].data) {
            if (history.profit === 0) {
              if (profit.length > 0) profit[0].profit -= history.order_amount;
            }
          }
      }

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
          $sort: {closing_time: -1},
        },
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

      if (result.length > 0) {
        if (result[0].data.length > 0)
          for (const history of result[0].data) {
            if (history.profit === 0) {
              if (profit.length > 0) profit[0].profit -= history.order_amount;
            }
          }
      }

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
          $sort: {closing_time: -1},
        },
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

      if (result.length > 0) {
        if (result[0].data.length > 0)
          for (const history of result[0].data) {
            if (history.profit === 0) {
              if (profit.length > 0) profit[0].profit -= history.order_amount;
            }
          }
      }

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

  public async hotfixUpdateStatus(
    id_user: Schema.Types.ObjectId,
    id_expert: Schema.Types.ObjectId,
    id_order: Schema.Types.ObjectId,
    id_copy: Schema.Types.ObjectId,
  ) {
    try {
      const result = await CPTradingHistorySchema.update({id_user, id_expert, id_order, id_copy}, {status: true});
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
  public async calculateProfitHistory(id_user) {
    try {
      const result = await CPTradingHistorySchema.aggregate([
        {
          $match: {
            id_user,
          },
        },
      ]);

      const profit = await CPTradingHistorySchema.aggregate([
        {
          $match: {
            id_user,
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

      if (result.length > 0) {
        for (const history of result) {
          if (history.profit === 0) {
            if (profit.length > 0) profit[0].profit -= history.order_amount;
          }
        }
      }
      return profit;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
