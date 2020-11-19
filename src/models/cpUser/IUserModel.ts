import mongoose from 'mongoose';

export default interface IUserModel extends mongoose.Document {
  full_name: string;
  user_name: string;
  email: string;
  phone: string;
  total_amount: number;
  is_admin: boolean;
}
