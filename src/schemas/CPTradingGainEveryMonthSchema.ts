import ITradingGainEveryMonthModel from '@src/models/cpTradingGainEveryMonth/ITradingGainEveryMonthModel';
import mongoose, {Schema} from 'mongoose';

class CPTradingGainEveryMonthSchema {
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
      copier: {
        type: Number,
        required: true,
      },
      removed_copier: {
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

export default mongoose.model<ITradingGainEveryMonthModel>(
  'cp_trading_gain_every_month',
  CPTradingGainEveryMonthSchema.schema,
);
