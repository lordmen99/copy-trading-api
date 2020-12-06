import IUserModel from '@src/models/cpUser/IUserModel';
import {contants} from '@src/utils';
import mongoose, {Schema} from 'mongoose';
class UserSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      id_user_trading: {type: Schema.Types.ObjectId},
      fullname: {type: Schema.Types.String},
      username: {type: Schema.Types.String},
      hashed_password: {type: Schema.Types.String},
      salt: {type: Schema.Types.String},
      email: {type: Schema.Types.String},
      phone: {type: Schema.Types.String},
      avatar: {type: Schema.Types.String},
      total_amount: {type: Number, required: true},
      is_virtual: {type: Boolean, required: true, default: 0},
      status: {type: Schema.Types.String, required: true, default: contants.STATUS.ACTIVE},
      status_trading_copy: {type: Schema.Types.String, required: true, default: contants.STATUS.ACTIVE},
      blockedAt: {type: Schema.Types.Date},
    });
    return schema;
  }
}

export default mongoose.model<IUserModel>('cp_users', UserSchema.schema);
