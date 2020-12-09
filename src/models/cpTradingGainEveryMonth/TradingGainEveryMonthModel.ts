import {Schema} from 'mongoose';
import ITradingGainEveryMonthModel from './ITradingGainEveryMonthModel';
export default class TradingGainModel {
  private _tradingGainEveryMonthModel: ITradingGainEveryMonthModel;

  constructor(TradingGainEveryMonthModel: ITradingGainEveryMonthModel) {
    this._tradingGainEveryMonthModel = TradingGainEveryMonthModel;
  }

  get id_expert(): Schema.Types.ObjectId {
    return this._tradingGainEveryMonthModel.id_expert;
  }

  get total_gain(): number {
    return this._tradingGainEveryMonthModel.total_gain;
  }

  get createdAt(): Date {
    return this._tradingGainEveryMonthModel.createdAt;
  }

  get updatedAt(): Date {
    return this._tradingGainEveryMonthModel.updatedAt;
  }
}
