import mongoose, {Schema} from 'mongoose';

export default interface ITradingGainEveryMonthModel extends mongoose.Document {
  id_expert: Schema.Types.ObjectId;
  total_gain: number;
  createdAt?: Date;
  updatedAt?: Date;
}
