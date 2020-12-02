import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import mongoose from 'mongoose';

class TradingWithdrawSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      id_user: {
        type: String,
        required: true,
      },
      id_expert: {
        type: String,
      },
      amount: {
        type: Number,
        required: true,
      },
      type_of_withdraw: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
      },
      updatedAt: {
        type: Date,
      },
    });
    return schema;
  }
}

export default mongoose.model<ITradingWithdrawModel>('cp_trading_withdraw', TradingWithdrawSchema.schema);
