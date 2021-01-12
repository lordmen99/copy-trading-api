import mongoose, {Schema} from 'mongoose';

export default interface ICommissionRefLogModel extends mongoose.Document {
  id_user: Schema.Types.ObjectId;
  id_user_ref: Schema.Types.ObjectId;
  level: Schema.Types.Number;
  volume: Schema.Types.Decimal128;
  type: Schema.Types.Number; // 0: Sell - 1: Buy
  is_withdraw: Schema.Types.Boolean;
  createdAt: Schema.Types.Date;
  orderedAt: Schema.Types.Date;
}
