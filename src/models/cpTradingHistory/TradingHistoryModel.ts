import {Schema} from 'mongoose';
import ITradingHistoryModel from './ITradingHistoryModel';
export default class TradingHistoryModel {
  private _tradingHistoryModel: ITradingHistoryModel;

  constructor(TradingHistoryModel: ITradingHistoryModel) {
    this._tradingHistoryModel = TradingHistoryModel;
  }

  get id_user(): Schema.Types.ObjectId {
    return this._tradingHistoryModel.id_user;
  }

  get id_expert(): Schema.Types.ObjectId {
    return this._tradingHistoryModel.id_expert;
  }

  get id_order(): Schema.Types.ObjectId {
    return this._tradingHistoryModel.id_order;
  }

  get opening_time(): Date {
    return this._tradingHistoryModel.opening_time;
  }

  get opening_price(): number {
    return this._tradingHistoryModel.opening_price;
  }

  get closing_time(): Date {
    return this._tradingHistoryModel.closing_time;
  }

  get closing_price(): number {
    return this._tradingHistoryModel.closing_price;
  }

  get investment_amount(): number {
    return this._tradingHistoryModel.investment_amount;
  }

  get order_amount(): number {
    return this._tradingHistoryModel.order_amount;
  }

  get profit(): number {
    return this._tradingHistoryModel.profit;
  }

  get fee_to_expert(): number {
    return this._tradingHistoryModel.fee_to_expert;
  }

  get fee_to_trading(): number {
    return this._tradingHistoryModel.fee_to_trading;
  }

  get type_of_money(): string {
    return this._tradingHistoryModel.type_of_money;
  }

  get type_of_order(): string {
    return this._tradingHistoryModel.type_of_order;
  }

  get status(): boolean {
    return this._tradingHistoryModel.status;
  }
}
