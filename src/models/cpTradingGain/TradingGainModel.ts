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

  get total_gain(): number {
    return this._tradingGainModel.total_gain;
  }

  get createdAt(): Date {
    return this._tradingGainModel.createdAt;
  }
}
