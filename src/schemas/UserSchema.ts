import IUserModel from '@src/models/cpUser/IUserModel';
import mongoose from 'mongoose';
class UserSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      full_name: {
        type: String,
      },
      user_name: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone: {
        type: String,
      },
      total_amount: {
        type: Number,
        required: true,
      },
      is_admin: {
        type: Boolean,
        required: true,
        default: 0,
      },
    });
    return schema;
  }
}

export default mongoose.model<IUserModel>('cp_users', UserSchema.schema);
