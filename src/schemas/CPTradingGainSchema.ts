import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import mongoose, {Schema} from 'mongoose';

class CPTradingGainSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      id_expert: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      total_gain: {
        type: Number,
        required: true,
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

export default mongoose.model<ITradingGainModel>('cp_trading_gain', CPTradingGainSchema.schema);
