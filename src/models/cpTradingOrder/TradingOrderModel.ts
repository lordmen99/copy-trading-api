import {Schema} from 'mongoose';
import ITradingOrderModel from './ITradingOrderModel';

export default class TradingOrderModel {
  private _tradingOrderModel: ITradingOrderModel;

  constructor(TradingOrderModel: ITradingOrderModel) {
    this._tradingOrderModel = TradingOrderModel;
  }

  get id_expert(): Schema.Types.ObjectId {
    return this._tradingOrderModel.id_expert;
  }

  get id_admin(): Schema.Types.ObjectId {
    return this._tradingOrderModel.id_admin;
  }

  get type_of_order(): string {
    return this._tradingOrderModel.type_of_order;
  }

  get threshold_percent(): number {
    return this._tradingOrderModel.threshold_percent;
  }

  get status(): string {
    return this._tradingOrderModel.status;
  }

  get createdAt(): Date {
    return this._tradingOrderModel.createdAt;
  }

  get orderedAt(): Date {
    return this._tradingOrderModel.orderedAt;
  }

  get timeSetup(): Date {
    return this._tradingOrderModel.timeSetup;
  }
}
