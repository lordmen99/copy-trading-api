import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import mongoose from 'mongoose';

class TradingOrderSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      id_user: {
        type: String,
        required: true,
      },
      id_expert: {
        type: String,
        required: true,
      },
      id_admin: {
        type: String,
        required: true,
      },
      type_of_order: {
        type: String,
        required: true,
      },
      threshold_percent: {
        type: Number,
        required: true,
      },
      threshold_amount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      total_amount: {
        type: Number,
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
      orderedAt: {
        type: Date,
        required: true,
      },
      timeSetup: {
        type: Date,
        required: true,
      },
    });
    return schema;
  }
}

export default mongoose.model<ITradingOrderModel>('cp_trading_order', TradingOrderSchema.schema);
