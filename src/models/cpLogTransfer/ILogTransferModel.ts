import mongoose, {Schema} from 'mongoose';

export default interface IUserModel extends mongoose.Document {
  id_user?: Schema.Types.ObjectId;
  username?: string;
  total_amount: number;
  amount: number;
  createdAt?: Date;
}
