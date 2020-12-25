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

  public async insertManyTradingWithdraw(arrTradingWithdraw: ITradingWithdrawModel[]) {
    try {
      const result = await CPTradingWithdrawSchema.insertMany(arrTradingWithdraw);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async calculateWithdrawCopyTrade() {
    try {
      const result = await CPTradingWithdrawSchema.aggregate([
        {
          $match: {
            type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER_TO_COPYTRADE,
            status: contants.STATUS.FINISH,
          },
        },
        {
          $group: {
            _id: null,
            amount: {$sum: '$amount'},
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async calculateWithdrawWallet() {
    try {
      const result = await CPTradingWithdrawSchema.aggregate([
        {
          $match: {
            type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER_TO_WALLET,
            status: contants.STATUS.FINISH,
          },
        },
        {
          $group: {
            _id: null,
            amount: {$sum: '$amount'},
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async calculateWithdrawWalletByUser(id_user) {
    try {
      const result = await CPTradingWithdrawSchema.aggregate([
        {
          $match: {
            type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER_TO_WALLET,
            status: contants.STATUS.FINISH,
            id_user,
          },
        },
        {
          $group: {
            _id: null,
            amount: {$sum: '$amount'},
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async calculateWithdrawCopyTradeByUser(id_user) {
    try {
      const result = await CPTradingWithdrawSchema.aggregate([
        {
          $match: {
            type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER_TO_COPYTRADE,
            status: contants.STATUS.FINISH,
            id_user,
          },
        },
        {
          $group: {
            _id: null,
            amount: {$sum: '$amount'},
          },
        },
      ]);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
