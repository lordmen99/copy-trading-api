import IUserModel from '@src/models/cpUser/IUserModel';
import mongoose from 'mongoose';
class UserSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      username: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
      },
      total_amount: {
        type: Number,
        required: true,
      },
    });
    return schema;
  }
}

export default mongoose.model<IUserModel>('user', UserSchema.schema);
