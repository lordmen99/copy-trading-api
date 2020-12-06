import mongoose, {Schema} from 'mongoose';

export default interface ITradingOrderModel extends mongoose.Document {
  id_order: Schema.Types.ObjectId;
  id_expert: Schema.Types.ObjectId; // id chuyên gia mà user thực hiện copy trading
  id_admin: Schema.Types.ObjectId; // id admin thực hiện đánh lệnh
  type_of_order: string; // loại lệnh đánh (win/lose)
  threshold_percent: number; // Số tiền đánh
  status: string; // ACTIVE là trạng thái đang chờ thực hiện, FINISH là trạng thái thực hiện xong rồi
  createdAt: Date;
  orderedAt: Date;
  timeSetup: Date;
}
