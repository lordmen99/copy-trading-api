import ICommissionRefLogModel from '@src/models/cpCommissionRefLogs/ICommissionRefLogModel';
import mongoose, {Schema} from 'mongoose';

class CpCommissionRefLogSchema {
  static get schema() {
    const schema = new mongoose.Schema(
      {
        id_user: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        id_user_ref: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        id_copy: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        id_history: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        level: {
          type: Schema.Types.Number,
          required: true,
        },
        investment_amount: {
          type: Schema.Types.Decimal128,
          required: true,
        },
        amount: {
          type: Schema.Types.Decimal128,
          required: true,
        },
        is_withdraw: {
          type: Schema.Types.Boolean,
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

export default mongoose.model<ICommissionRefLogModel>('cp_commission_ref_logs', CpCommissionRefLogSchema.schema);
