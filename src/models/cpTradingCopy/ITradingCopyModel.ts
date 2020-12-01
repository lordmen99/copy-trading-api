import mongoose from 'mongoose';

export default interface ITradingCopyModel extends mongoose.Document {
  id_user?: string; // id user nối với bảng bên trading
  id_expert?: string; // id chuyên gia mà user thực hiện copy trading
  investment_amount?: number; // Số tiền copy
  maximum_rate?: number; // % cao nhất số tiền khi đánh 1 lệnh
  has_maximum_rate?: boolean;
  stop_loss?: number;
  has_stop_loss?: boolean;
  taken_profit?: number;
  has_taken_profit?: boolean;
  status?: string; // ACTIVE là trạng thái đang follow, DELETE là trạng thái unfollow
  createdAt?: Date; // ACTIVE là trạng thái đang follow, DELETE là trạng thái unfollow
  updatedAt?: Date; // ACTIVE là trạng thái đang follow, DELETE là trạng thái unfollow
}
