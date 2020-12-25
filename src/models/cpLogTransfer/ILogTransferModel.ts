import mongoose, {Schema} from 'mongoose';

export default interface IUserModel extends mongoose.Document {
  id_user?: Schema.Types.ObjectId;
  username?: string;
  amount: number;
  createdAt?: Date;
}
