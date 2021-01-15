import ICommissionRefLogModel from '@src/models/cpCommissionRefLogs/ICommissionRefLogModel';
import CPCommissionRefLogSchema from '@src/schemas/CPCommissionRefLogSchema';
import { RepositoryBase } from './base';

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
              $lte: toDate
            }
          }
        },
        {
          $group: {
            _id: {
              id_user_ref: "$id_user_ref",
              level: "$level",
            },
            list_user_investment: {
              $addToSet: {
                id_user: "$id_user",
                id_copy: "$id_copy",
                investment_amount: "$investment_amount"
              }
            },
            history_logs: {
              $addToSet: {
                id: "$_id",
                id_copy: "$id_copy",
                id_history: "$id_history",
                amount: "$amount"
              }
            }
          }
        },
        {
          $group: {
            _id: "$_id.id_user_ref",
            level: {
              $push: {
                level: "$_id.level",
                list_user_investment: "$list_user_investment",
                history_logs: "$history_logs"
              }
            }
          }
        }
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
            level: { $lte: 10 },
            is_withdraw: false
          }
        },
        {
          $group: {
            _id: "$id_user_ref",
            history_logs: {
              $addToSet: {
                id: "$_id",
                id_user: "$id_user",
                id_copy: "$id_copy",
                id_history: "$id_history",
                level: "$level",
                amount: "$amount"
              }
            }
          }
        }
      ]);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}