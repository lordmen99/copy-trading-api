import ICommissionRefLogModel from '@src/models/cpCommissionRefLogs/ICommissionRefLogModel';
import CPCommissionRefLogSchema from '@src/schemas/CPCommissionRefLogSchema';
import {Schema} from 'mongoose';
import {RepositoryBase} from './base';

export default class CommissionRefLogRepository extends RepositoryBase<ICommissionRefLogModel> {
  constructor() {
    super(CPCommissionRefLogSchema);
  }

  public async insertManyCommissionRefLog(arrCommissionRefLog: ICommissionRefLogModel[]) {
    try {
      const result = await CPCommissionRefLogSchema.insertMany(arrCommissionRefLog);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async getCommissionWithLevel(fromDate: Date, toDate: Date) {
    try {
      const result = await CPCommissionRefLogSchema.aggregate([
        {
          $match: {
            createdAt: {
              $gte: fromDate,
              $lte: toDate,
            },
          },
        },
        {
          $group: {
            _id: {
              id_user_ref: '$id_user_ref',
              level: '$level',
            },
            list_user_investment: {
              $addToSet: {
                id_user: '$id_user',
                id_copy: '$id_copy',
                investment_amount: '$investment_amount',
              },
            },
            history_logs: {
              $addToSet: {
                id: '$_id',
                id_copy: '$id_copy',
                id_history: '$id_history',
                amount: '$amount',
              },
            },
          },
        },
        {
          $group: {
            _id: '$_id.id_user_ref',
            level: {
              $push: {
                level: '$_id.level',
                list_user_investment: '$list_user_investment',
                history_logs: '$history_logs',
              },
            },
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async getCommissionHistory() {
    try {
      const result = await CPCommissionRefLogSchema.aggregate([
        {
          $match: {
            level: {$lte: 10},
            is_withdraw: false,
          },
        },
        {
          $group: {
            _id: '$id_user_ref',
            history_logs: {
              $addToSet: {
                id: '$_id',
                level: '$level',
                amount: '$amount',
              },
            },
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async updateAmountWithdraw(id: Schema.Types.ObjectId, amount_withdraw: number) {
    try {
      const result = await CPCommissionRefLogSchema.findOneAndUpdate({_id: id}, {amount_withdraw, is_withdraw: true});
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async getComissionOfUser(id: string, page: number, size: number, fromDate: Date, toDate: Date) {
    try {
      const result = await CPCommissionRefLogSchema.aggregate([
        {
          $match: {
            id_user_ref: this.toObjectId(id),
            createdAt: {
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
                  from: 'cp_users',
                  localField: 'id_user',
                  foreignField: 'id_user_trading',
                  as: 'user_level',
                },
              },
              {
                $unwind: '$user_level',
              },
              {
                $project: {
                  _id: 1,
                  amount: 1,
                  amount_withdraw: 1,
                  createdAt: 1,
                  level: 1,
                  username: '$user_level.username',
                },
              },
            ],
            totalCount: [{$count: 'count'}],
          },
        },
        {$unwind: '$totalCount'},
        {$project: {data: '$data', count: '$totalCount.count'}},
      ]);
      if (result.length > 0) {
        const count = await CPCommissionRefLogSchema.countDocuments(item);

        const profit = await CPCommissionRefLogSchema.aggregate([
          {
            $match: {
              id_user: this.toObjectId(item.id_user),
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
      } else {
        return {
          result: [],
          count: 0,
          profit: 0,
        };
      }
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
