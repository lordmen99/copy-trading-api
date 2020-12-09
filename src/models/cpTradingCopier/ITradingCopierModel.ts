import mongoose, {Schema} from 'mongoose';

export default interface ITradingCopierModel extends mongoose.Document {
  id_expert: Schema.Types.ObjectId;
  copier: number;
  removed_copier: number;
  createdAt?: Date;
  updatedAt?: Date;
}
