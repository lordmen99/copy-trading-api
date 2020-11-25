import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import mongoose from 'mongoose';

class TradingHistorySchema {
  static get schema() {
    const schema = new mongoose.Schema({
      id_user: {
        type: String,
        required: true,
        index: true,
      },
      id_expert: {
        type: String,
        required: true,
      },
      opening_time: {
        type: Date,
        required: true,
      },
      opening_price: {
        type: Number,
        required: true,
      },
      closing_time: {
        type: Date,
        required: true,
      },
      closing_price: {
        type: Number,
        required: true,
      },
      investment_amount: {
        type: Number,
        required: true,
      },
      profit: {
        type: Number,
        required: true,
      },
      fee_to_expert: {
        type: Number,
        required: true,
      },
      fee_to_trading: {
        type: Number,
        required: true,
      },
      type_of_money: {
        type: String,
        required: true,
      },
      type_of_order: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        required: true,
        default: 0,
      },
    });
    return schema;
  }
}

export default mongoose.model<ITradingHistoryModel>('cp_trading_history', TradingHistorySchema.schema);
