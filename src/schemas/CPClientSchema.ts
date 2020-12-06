import IClientModel from '@src/models/cpClient/IClientModel';
import mongoose from 'mongoose';

class CPClientSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      client_id: {
        type: String,
        required: true,
        unique: true,
      },
      client_secret: {
        type: String,
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

export default mongoose.model<IClientModel>('cp_client', CPClientSchema.schema);
