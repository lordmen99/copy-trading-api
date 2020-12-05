import mongoose, {Schema} from 'mongoose';

export default interface ITradingHistoryModel extends mongoose.Document {
  id_user: Schema.Types.ObjectId; // id user nối với bảng bên trading
  id_expert: Schema.Types.ObjectId; // id chuyên gia mà user thực hiện copy trading
  opening_time: Date; // Thời gian mở lệnh
  opening_price: number; // Giá mở lệnh
  closing_time: Date; // Thời gian đóng lệnh
  closing_price: number; // Giá đóng lệnh
  investment_amount: number; // Số tiền vào lệnh
  order_amount: number; // Số tiền đánh lệnh
  profit: number; // Lợi nhuân/Thua lỗ
  fee_to_expert: number; // Số tiền từ 5% lợi nhuận trả cho chuyên gia - Nếu thua thì giá trị sẽ là 0
  fee_to_trading: number; // Số tiền từ 5% lợi nhuận trả cho sàn - Nếu thua thì giá trị sẽ là 0
  type_of_money: string; // Loại tiền sử dụng (BTC/USD)
  type_of_order: string; // Loại lệnh thực hiện (Sell/Buy)
  status: boolean; // 0: trạng thái chưa trả lợi nhuận cho chuyên gia, 1: Đã trả lợi nhuận cho chuyên gia
}
