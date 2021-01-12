import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import mongoose, {Schema} from 'mongoose';

class CpCommissionRefLogSchema {
  static get schema() {
    const schema = new mongoose.Schema(
      {
        id_expert: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        total_gain: {
          type: Number,
          required: true,
        },
      },
      {
        timestamps: true,
      },
    );
    return schema;
  }
}

export default mongoose.model<ITradingGainModel>('cp_commission_ref_logs', CpCommissionRefLogSchema.schema);
