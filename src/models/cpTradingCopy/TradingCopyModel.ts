import ITradingCopyModel from './ITradingCopyModel';

export default class TradingHistoryModel {
  private _tradingCopyModel: ITradingCopyModel;

  constructor(TradingCopyModel: ITradingCopyModel) {
    this._tradingCopyModel = TradingCopyModel;
  }

  get id_user(): string {
    return this._tradingCopyModel.id_user;
  }

  get id_expert(): string {
    return this._tradingCopyModel.id_expert;
  }

  get investment_amount(): number {
    return this._tradingCopyModel.investment_amount;
  }

  get maximum_rate(): number {
    return this._tradingCopyModel.maximum_rate;
  }

  get stop_loss(): number {
    return this._tradingCopyModel.stop_loss;
  }

  get taken_profit(): number {
    return this._tradingCopyModel.taken_profit;
  }

  get status(): string {
    return this._tradingCopyModel.status;
  }

  get createdAt(): Date {
    return this._tradingCopyModel.createdAt;
  }

  get updatedAt(): Date {
    return this._tradingCopyModel.updatedAt;
  }
}
