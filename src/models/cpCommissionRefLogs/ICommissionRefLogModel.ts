import mongoose, {Schema} from 'mongoose';

export default interface ICommissionRefLogModel extends mongoose.Document {
  id_user: Schema.Types.ObjectId; // id user lấy bên bảng user trading
  id_user_ref: Schema.Types.ObjectId; // id user lấy bên bảng user trading
  id_copy: Schema.Types.ObjectId;
  id_history: Schema.Types.ObjectId;
  level: Schema.Types.Number;
  investment_amount: Schema.Types.Decimal128;
  amount: Schema.Types.Decimal128;
  is_withdraw: Schema.Types.Boolean;
  createdAt: Schema.Types.Date;
}
