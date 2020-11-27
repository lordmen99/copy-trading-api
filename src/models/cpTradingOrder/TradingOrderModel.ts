import ITradingOrderModel from './ITradingOrderModel';

export default class TradingOrderModel {
  private _tradingOrderModel: ITradingOrderModel;

  constructor(TradingOrderModel: ITradingOrderModel) {
    this._tradingOrderModel = TradingOrderModel;
  }

  get id_user(): string {
    return this._tradingOrderModel.id_user;
  }

  get id_expert(): string {
    return this._tradingOrderModel.id_expert;
  }

  get id_admin(): string {
    return this._tradingOrderModel.id_admin;
  }

  get type_of_order(): string {
    return this._tradingOrderModel.type_of_order;
  }

  get threshold_amount(): number {
    return this._tradingOrderModel.threshold_amount;
  }

  get threshold_percent(): number {
    return this._tradingOrderModel.threshold_percent;
  }

  get type(): string {
    return this._tradingOrderModel.type;
  }

  get total_amount(): number {
    return this._tradingOrderModel.total_amount;
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
