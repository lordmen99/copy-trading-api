import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import mongoose, {Schema} from 'mongoose';

class TradingOrderSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      id_expert: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      id_admin: {
        type: Schema.Types.ObjectId,
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
