import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import CPTradingWithdrawSchema from '@src/schemas/CPTradingWithdrawSchema';
import {contants} from '@src/utils';
import mongoose from 'mongoose';
import {RepositoryBase} from './base';

export default class TradingWithdrawRepository extends RepositoryBase<ITradingWithdrawModel> {
  constructor() {
    super(CPTradingWithdrawSchema);
  }
  public async getUserWalletHistory(id_user, page, size): Promise<any> {
    try {
      const result = await CPTradingWithdrawSchema.aggregate([
        {
          $match: {
            type_of_withdraw: {
              $in: [contants.TYPE_OF_WITHDRAW.TRANSFER_TO_WALLET, contants.TYPE_OF_WITHDRAW.TRANSFER_TO_COPYTRADE],
            },
            id_user: new mongoose.Types.ObjectId(id_user),
          },
        },
        {
          $facet: {
            total: [{$group: {_id: null, count: {$sum: 1}}}],
            data: [
              {$skip: (parseInt(page.toString()) - 1) * parseInt(size.toString())},
              {$limit: parseInt(size.toString())},
            ],
          },
        },
        {$unwind: '$total'},
        {$project: {count: '$total.count', data: '$data'}},
      ]);

      if (result) {
        return result;
      }
      return null;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
