import mongoose, {Schema} from 'mongoose';

export default interface ITradingGainModel extends mongoose.Document {
  id_expert: Schema.Types.ObjectId;
  total_gain: number;
  createdAt?: Date;
  updatedAt?: Date;
}
