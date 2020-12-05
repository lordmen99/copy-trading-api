import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import {contants} from '@src/utils';
import mongoose, {Schema} from 'mongoose';

class CPTradingCopySchema {
  static get schema() {
    const schema = new mongoose.Schema({
      id_user: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      id_expert: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      investment_amount: {
        type: Number,
        required: true,
      },
      base_amount: {
        type: Number,
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

export default mongoose.model<ITradingCopyModel>('cp_trading_copy', CPTradingCopySchema.schema);
