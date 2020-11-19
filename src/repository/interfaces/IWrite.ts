import mongoose from 'mongoose';

export default interface IWrite<T extends mongoose.Document> {
  create(item: T): Promise<T>;
  update(id: mongoose.Types.ObjectId, item: T): Promise<T>;
  delete(id: mongoose.Types.ObjectId): Promise<boolean>;
}
