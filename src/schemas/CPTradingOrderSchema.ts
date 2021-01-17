import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import mongoose, {Schema} from 'mongoose';

class CPTradingOrderSchema {
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
        type: Schema.Types.String,
        required: true,
      },
      threshold_percent: {
        type: Schema.Types.Number,
        required: true,
      },
      status: {
        type: Schema.Types.String,
        required: true,
      },
      createdAt: {
        type: Schema.Types.Date,
      },
      orderedAt: {
        type: Schema.Types.Date,
      },
      timeSetup: {
        type: Schema.Types.Date,
        required: true,
      },
      timeZone: {
        type: Schema.Types.String,
      },
      endDate: {
        type: Schema.Types.Date,
      },
    });
    return schema;
  }
}

export default mongoose.model<ITradingOrderModel>('cp_trading_order', CPTradingOrderSchema.schema);
