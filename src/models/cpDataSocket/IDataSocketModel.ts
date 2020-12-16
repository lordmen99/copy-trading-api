import mongoose from 'mongoose';

export default interface IDataSocketModel extends mongoose.Document {
  absoluteChange: string;
  close: number;
  date: Date;
  dividend: string;
  high: number;
  is_open: boolean;
  low: number;
  open: number;
  percentChange: string;
  split: string;
  volume: number;
}
