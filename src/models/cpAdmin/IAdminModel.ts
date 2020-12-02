import mongoose from 'mongoose';

export default interface IAdminModel extends mongoose.Document {
  fullname: string;
  username: string;
  password?: string;
  hashed_password?: string;
  salt?: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
}
