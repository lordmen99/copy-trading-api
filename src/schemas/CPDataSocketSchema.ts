import IDataSocketModel from '@src/models/cpDataSocket/IDataSocketModel';
import mongoose, {Schema} from 'mongoose';
class CPDataSocketSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      absoluteChange: {type: Schema.Types.String},
      close: {type: Number, required: true},
      date: {type: Date, required: true},
      dividend: {type: Schema.Types.String},
      high: {type: Number, required: true},
      is_open: {type: Boolean, required: true},
      low: {type: Number, required: true},
      open: {type: Number, required: true},
      percentChange: {type: Schema.Types.String},
      split: {type: Schema.Types.String},
      volume: {type: Number, required: true},
    });
    return schema;
  }
}

export default mongoose.model<IDataSocketModel>('cp_data_socket', CPDataSocketSchema.schema);
