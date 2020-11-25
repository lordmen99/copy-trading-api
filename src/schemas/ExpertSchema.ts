import IExpertModel from '@src/models/cpExpert/IExpertModel';
import mongoose from 'mongoose';

class ExpertSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      fullname: {
        type: String,
        index: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      hashed_password: {
        type: String,
        // required: true,
      },
      salt: {
        type: String,
        // required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone: {
        type: String,
      },
      avatar: {
        type: String,
      },
      total_amount: {
        type: Number,
        required: true,
      },
      is_virtual: {
        type: Boolean,
        required: true,
        default: 0,
      },
      status: {
        type: String,
        required: true,
        default: 'ACTIVE',
      },
    });
    return schema;
  }
}

export default mongoose.model<IExpertModel>('cp_expert', ExpertSchema.schema);
