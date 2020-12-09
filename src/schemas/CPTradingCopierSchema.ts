import ITradingCopierModel from '@src/models/cpTradingCopier/ITradingCopierModel';
import mongoose, {Schema} from 'mongoose';

class CPTradingCopierSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      id_expert: {
        type: Schema.Types.ObjectId,
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

export default mongoose.model<ITradingCopierModel>('cp_trading_copier', CPTradingCopierSchema.schema);
