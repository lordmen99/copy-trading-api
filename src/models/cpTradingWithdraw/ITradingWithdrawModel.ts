import mongoose, {Schema} from 'mongoose';

export default interface ITradingHistoryModel extends mongoose.Document {
  id_user: Schema.Types.ObjectId;
  id_expert: Schema.Types.ObjectId;
  id_copy: Schema.Types.ObjectId;
  id_order: Schema.Types.ObjectId;
  amount: number;
  type_of_withdraw: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt: Date;
}
