import mongoose from 'mongoose';

export default interface IExpertModel extends mongoose.Document {
  fullname?: string;
  username?: string;
  password?: string;
  hashed_password?: string;
  salt?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  total_amount?: number;
  is_virtual?: boolean;
  status?: string;
}
