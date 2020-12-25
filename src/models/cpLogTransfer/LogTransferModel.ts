import {Schema} from 'mongoose';
import ILogTransferModel from './ILogTransferModel';

export default class UserModel {
  private _logTransferModel: ILogTransferModel;

  constructor(LogTransferModel: ILogTransferModel) {
    this._logTransferModel = LogTransferModel;
  }

  get id_user(): Schema.Types.ObjectId {
    return this._logTransferModel.id_user;
  }

  get username(): string {
    return this._logTransferModel.username;
  }

  get amount(): number {
    return this._logTransferModel.amount;
  }

  get createdAt(): Date {
    return this._logTransferModel.createdAt;
  }
}
