import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import mongoose from 'mongoose';

class TradingCopySchema {
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
      investment_amount: {
        type: Number,
        required: true,
      },
      maximum_rate: {
        type: Number,
        required: true,
      },
      stop_loss: {
        type: Number,
        required: true,
      },
      taken_profit: {
        type: Number,
        required: true,
      },
    });
    return schema;
  }
}

export default mongoose.model<ITradingCopyModel>('cp_trading_history', TradingCopySchema.schema);
