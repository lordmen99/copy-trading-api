import IExpertModel from '@src/models/cpExpert/IExpertModel';
import {contants} from '@src/utils';
import mongoose from 'mongoose';

class CPExpertSchema {
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
      virtual_copier: {
        type: Number,
        default: 0,
      },
      real_copier: {
        type: Number,
        default: 0,
      },
      base_amount: {
        type: Number,
        required: true,
      },
      auto_gen_copier: {
        type: Boolean,
        default: 0,
      },
      from_copier: {
        type: Number,
      },
      to_copier: {
        type: Number,
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

export default mongoose.model<IExpertModel>('cp_expert', CPExpertSchema.schema);
