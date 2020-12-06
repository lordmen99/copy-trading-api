import {Schema} from 'mongoose';
import ITradingWithdrawModel from './ITradingWithdrawModel';

export default class TradingWithdrawModel {
  private _tradingWithdrawModel: ITradingWithdrawModel;

  constructor(ITradingWithdrawModel: ITradingWithdrawModel) {
    this._tradingWithdrawModel = ITradingWithdrawModel;
  }

  get id_user(): Schema.Types.ObjectId {
    return this._tradingWithdrawModel.id_user;
  }

  get id_expert(): Schema.Types.ObjectId {
    return this._tradingWithdrawModel.id_expert;
  }

  get id_copy(): Schema.Types.ObjectId {
    return this._tradingWithdrawModel.id_copy;
  }

  get id_order(): Schema.Types.ObjectId {
    return this._tradingWithdrawModel.id_order;
  }

  get amount(): number {
    return this._tradingWithdrawModel.amount;
  }

  get createdAt(): Date {
    return this._tradingWithdrawModel.createdAt;
  }

  get updatedAt(): Date {
    return this._tradingWithdrawModel.updatedAt;
  }

  get type_of_withdraw(): string {
    return this._tradingWithdrawModel.type_of_withdraw;
  }

  get status(): string {
    return this._tradingWithdrawModel.status;
  }
}
