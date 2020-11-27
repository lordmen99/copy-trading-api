import mongoose from 'mongoose';

export default interface ITradingOrderModel extends mongoose.Document {
  id_user: string; // id user nối với bảng bên trading
  id_expert: string; // id chuyên gia mà user thực hiện copy trading
  id_admin: string; // id admin thực hiện đánh lệnh
  type_of_order: string; // loại lệnh đánh (win/lose)
  threshold_percent: number; // Số tiền đánh
  threshold_amount: number; // Số tiền đánh
  type: string; // loại lệnh đánh (win/lose)
  total_amount: number; // Số tiền đánh
  status: string; // ACTIVE là trạng thái đang chờ thực hiện, FINISH là trạng thái thực hiện xong rồi
  createdAt: Date;
  updatedAt: Date;
}
