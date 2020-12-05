import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import mongoose, {Schema} from 'mongoose';

class TradingWithdrawSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      id_user: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      id_expert: {
        type: Schema.Types.ObjectId,
      },
      id_copy: {
        type: Schema.Types.ObjectId,
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
