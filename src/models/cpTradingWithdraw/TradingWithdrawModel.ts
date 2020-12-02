import ITradingWithdrawModel from './ITradingWithdrawModel';

export default class TradingWithdrawModel {
  private _tradingWithdrawModel: ITradingWithdrawModel;

  constructor(ITradingWithdrawModel: ITradingWithdrawModel) {
    this._tradingWithdrawModel = ITradingWithdrawModel;
  }

  get id_user(): string {
    return this._tradingWithdrawModel.id_user;
  }

  get id_expert(): string {
    return this._tradingWithdrawModel.id_expert;
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
