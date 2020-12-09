import {Schema} from 'mongoose';
import ITradingCopierModel from './ITradingCopierModel';
export default class TradingCopierModel {
  private _tradingCopierModel: ITradingCopierModel;

  constructor(TradingCopierModel: ITradingCopierModel) {
    this._tradingCopierModel = TradingCopierModel;
  }

  get id_expert(): Schema.Types.ObjectId {
    return this._tradingCopierModel.id_expert;
  }

  get copier(): number {
    return this._tradingCopierModel.copier;
  }

  get removed_copier(): number {
    return this._tradingCopierModel.removed_copier;
  }

  get createdAt(): Date {
    return this._tradingCopierModel.createdAt;
  }

  get updatedAt(): Date {
    return this._tradingCopierModel.updatedAt;
  }
}
