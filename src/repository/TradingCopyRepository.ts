import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import CPTradingCopySchema from '@src/schemas/CPTradingCopySchema';
import {contants} from '@src/utils';
import mongoose, {Schema} from 'mongoose';
import {RepositoryBase} from './base';

export default class TradingCopyRepository extends RepositoryBase<ITradingCopyModel> {
  constructor() {
    super(CPTradingCopySchema);
  }

  public async getListCopies(item: any, page: number, size: number, orArray): Promise<any> {
    try {
      const result = await CPTradingCopySchema.aggregate([
        {
          $match: {
            status: {$in: orArray},
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
                  from: 'cp_experts',
                  localField: 'id_expert',
                  foreignField: '_id',
                  as: 'expert',
                },
              },
              {
                $project: {
                  _id: 1,
                  status: 1,
                  id_user: 1,
                  id_expert: 1,
                  investment_amount: 1,
                  maximum_rate: 1,
                  has_maximum_rate: 1,
                  has_stop_loss: 1,
                  has_taken_profit: 1,
                  stop_loss: 1,
                  taken_profit: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  base_amount: 1,
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

      const count = await CPTradingCopySchema.countDocuments(item).or([{status: {$in: orArray}}]);
      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async getListCopiesByExpert(item: any, page: number, size: number, orArray): Promise<any> {
    try {
      const result = await CPTradingCopySchema.aggregate([
        {
          $match: {
            status: {$in: orArray},
            id_expert: new mongoose.Types.ObjectId(item.id_expert),
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
                  foreignField: '_id',
                  as: 'user',
                },
              },
              {
                $project: {
                  _id: 1,
                  status: 1,
                  id_user: 1,
                  id_expert: 1,
                  investment_amount: 1,
                  maximum_rate: 1,
                  has_maximum_rate: 1,
                  has_stop_loss: 1,
                  has_taken_profit: 1,
                  stop_loss: 1,
                  taken_profit: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  base_amount: 1,
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

      const count = await CPTradingCopySchema.countDocuments(item).or([{status: {$in: orArray}}]);
      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async getUserCopyByExpert(item: any): Promise<any> {
    try {
      const result = await CPTradingCopySchema.aggregate([
        {
          $match: {
            id_expert: new mongoose.Types.ObjectId(item._id),
          },
        },
        {
          $facet: {
            data: [
              // {$skip: (parseInt(page.toString()) - 1) * parseInt(size.toString())},
              // {$limit: parseInt(size.toString())},
              {
                $lookup: {
                  from: 'cp_experts',
                  localField: 'id_expert',
                  foreignField: '_id',
                  as: 'experts',
                },
              },
              {
                $lookup: {
                  from: 'cp_users',
                  localField: 'id_user',
                  foreignField: '_id',
                  as: 'users',
                },
              },
              {
                $project: {
                  experts: {
                    _id: 1,
                    status: 1,
                    fullname: 1,
                    username: 1,
                    email: 1,
                    phone: 1,
                    avatar: 1,
                    total_amount: 1,
                  },
                  users: {
                    _id: 1,
                    status: 1,
                    status_trading_copy: 1,
                    fullname: 1,
                    username: 1,
                    email: 1,
                    phone: 1,
                    avatar: 1,
                    total_amount: 1,
                  },
                },
              },
            ],
          },
        },
        {$project: {data: '$data'}},
      ]);

      return {
        result,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async insertManyTradingCopy(arrTradingCopy: ITradingCopyModel[]) {
    try {
      const result = await CPTradingCopySchema.insertMany(arrTradingCopy);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async updateManyPauseCopy(arrIds: Schema.Types.ObjectId[]) {
    try {
      const result = await CPTradingCopySchema.updateMany(
        {_id: {$in: arrIds}},
        {
          status: contants.STATUS.PAUSE,
        },
      );
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async count(item) {
    try {
      const result = await CPTradingCopySchema.count(item);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
