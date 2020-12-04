import mongoose from 'mongoose';

export default interface IRealUserModel extends mongoose.Document {
  total_amount: number;
  username: string;
  password?: string;
}
