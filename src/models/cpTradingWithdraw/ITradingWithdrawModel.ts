import mongoose from 'mongoose';

export default interface ITradingHistoryModel extends mongoose.Document {
  id_user: string;
  id_expert: string;
  amount: number;
  type_of_withdraw: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
