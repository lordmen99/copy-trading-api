import mongoose, { Schema } from 'mongoose';

export default interface ICommissionRefLogModel extends mongoose.Document {
  id_user: Schema.Types.ObjectId; // id user lấy bên bảng user trading
  id_user_ref: Schema.Types.ObjectId; // id user lấy bên bảng user trading
  id_copy: Schema.Types.ObjectId;
  id_history: Schema.Types.ObjectId;
  level: number;
  investment_amount: number;
  amount: number;
  amount_withdraw: number;
  is_withdraw: boolean;
  createdAt: Date;
}
