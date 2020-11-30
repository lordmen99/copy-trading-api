import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import {contants} from '@src/utils';
import mongoose from 'mongoose';

class TradingCopySchema {
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
      investment_amount: {
        type: Number,
        required: true,
      },
      maximum_rate: {
        type: Number,
        required: true,
      },
      has_maximum_rate: {
        type: Boolean,
        required: true,
      },
      stop_loss: {
        type: Number,
        required: true,
      },
      has_stop_loss: {
        type: Boolean,
        required: true,
      },
      taken_profit: {
        type: Number,
        required: true,
      },
      has_taken_profit: {
        type: Boolean,
        required: true,
      },
      status: {
        type: String,
        required: true,
        default: contants.STATUS.ACTIVE,
      },
      createdAt: {
        type: Date,
        required: true,
      },
      updatedAt: {
        type: Date,
        required: true,
      },
    });
    return schema;
  }
}

export default mongoose.model<ITradingCopyModel>('cp_trading_copy', TradingCopySchema.schema);
