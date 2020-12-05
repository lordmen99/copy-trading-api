import IAdminModel from '@src/models/cpAdmin/IAdminModel';
import {contants} from '@src/utils';
import mongoose from 'mongoose';
class CPAdminSchema {
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
        required: true,
      },
      salt: {
        type: String,
        required: true,
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
      status: {
        type: String,
        required: true,
        default: contants.STATUS.ACTIVE,
      },
    });
    return schema;
  }
}

export default mongoose.model<IAdminModel>('cp_admin', CPAdminSchema.schema);
