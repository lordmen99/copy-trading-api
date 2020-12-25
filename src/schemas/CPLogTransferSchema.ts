import ILogTransferModel from '@src/models/cpLogTransfer/ILogTransferModel';
import mongoose, {Schema} from 'mongoose';
class CPLogTransferSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      id_user: {type: Schema.Types.ObjectId},
      username: {type: Schema.Types.String},
      total_amount: {type: Schema.Types.Number},
      amount: {type: Schema.Types.Number},
      createdAt: {type: Schema.Types.Date},
    });
    return schema;
  }
}

export default mongoose.model<ILogTransferModel>('cp_log_transfer', CPLogTransferSchema.schema);
