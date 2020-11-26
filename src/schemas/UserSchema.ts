import IUserModel from '@src/models/cpUser/IUserModel';
import {contants} from '@src/utils';
import mongoose from 'mongoose';
class UserSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      fullname: {
        type: String,
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
        default: contants.STATUS.ACTIVE,
      },
    });
    return schema;
  }
}

export default mongoose.model<IUserModel>('cp_users', UserSchema.schema);
