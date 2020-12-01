import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import mongoose from 'mongoose';

class TradingHistorySchema {
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
    });
    return schema;
  }
}

export default mongoose.model<ITradingHistoryModel>('cp_trading_history', TradingHistorySchema.schema);
