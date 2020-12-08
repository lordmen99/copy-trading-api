import mongoose, {Schema} from 'mongoose';

export default interface ITradingGainModel extends mongoose.Document {
  id_expert: Schema.Types.ObjectId;
  gain_last_month: number;
  gain_last_year: number;
  total_gain: number;
  createdAt?: Date;
  updatedAt?: Date;
}
