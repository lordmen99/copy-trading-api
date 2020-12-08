import {Schema} from 'mongoose';
import ITradingGainModel from './ITradingGainModel';
export default class TradingGainModel {
  private _tradingGainModel: ITradingGainModel;

  constructor(TradingGainModel: ITradingGainModel) {
    this._tradingGainModel = TradingGainModel;
  }

  get id_expert(): Schema.Types.ObjectId {
    return this._tradingGainModel.id_expert;
  }

  get gain_last_month(): number {
    return this._tradingGainModel.gain_last_month;
  }

  get total_gain(): number {
    return this._tradingGainModel.total_gain;
  }

  get createdAt(): Date {
    return this._tradingGainModel.createdAt;
  }

  get updatedAt(): Date {
    return this._tradingGainModel.updatedAt;
  }
}
