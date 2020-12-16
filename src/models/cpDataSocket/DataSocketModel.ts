import IDataSocketModel from './IDataSocketModel';

export default class UserModel {
  private _dataSocketModel: IDataSocketModel;

  constructor(UserModel: IDataSocketModel) {
    this._dataSocketModel = UserModel;
  }
  get absoluteChange(): string {
    return this._dataSocketModel.absoluteChange;
  }

  get close(): number {
    return this._dataSocketModel.close;
  }

  get date(): Date {
    return this._dataSocketModel.date;
  }

  get dividend(): string {
    return this._dataSocketModel.dividend;
  }

  get high(): number {
    return this._dataSocketModel.high;
  }

  get is_open(): boolean {
    return this._dataSocketModel.is_open;
  }

  get low(): number {
    return this._dataSocketModel.low;
  }

  get open(): number {
    return this._dataSocketModel.open;
  }

  get percentChange(): string {
    return this._dataSocketModel.percentChange;
  }

  get split(): string {
    return this._dataSocketModel.split;
  }

  get volume(): number {
    return this._dataSocketModel.volume;
  }
}
