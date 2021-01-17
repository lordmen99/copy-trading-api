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
  base_amount?: number;
  is_virtual?: boolean;
  status?: string;
  virtual_copier: number;
  real_copier: number;
  auto_gen_copier: boolean;
  from_copier: number;
  to_copier: number;
}