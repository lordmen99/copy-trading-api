import mongoose from 'mongoose';

export default interface IUserModel extends mongoose.Document {
  _id: string;
  fullname: string;
  username: string;
  password?: string;
  hashed_password?: string;
  salt?: string;
  email: string;
  phone: string;
  avatar?: string;
  total_amount: number;
  is_virtual: boolean;
  status?: string;
  status_trading_copy?: string;
  blockedAt?: Date;
}
