import { Schema } from 'mongoose';
import ICommissionRefLogModel from './ICommissionRefLogModel';

export default class CommissionRefLogModel {
  private _commissionRefLogModel: ICommissionRefLogModel;

  constructor(CommissionRefLogModel: ICommissionRefLogModel) {
    this._commissionRefLogModel = CommissionRefLogModel;
  }

  get id_user(): Schema.Types.ObjectId {
    return this._commissionRefLogModel.id_user;
  }

  get id_user_ref(): Schema.Types.ObjectId {
    return this._commissionRefLogModel.id_user_ref;
  }

  get id_copy(): Schema.Types.ObjectId {
    return this._commissionRefLogModel.id_copy;
  }

  get id_history(): Schema.Types.ObjectId {
    return this._commissionRefLogModel.id_history;
  }

  get level(): number {
    return this._commissionRefLogModel.level;
  }

  get investment_amount(): number {
    return this._commissionRefLogModel.investment_amount;
  }

  get amount(): number {
    return this._commissionRefLogModel.amount;
  }

  get amount_withdraw(): number {
    return this._commissionRefLogModel.amount_withdraw;
  }

  get is_withdraw(): boolean {
    return this._commissionRefLogModel.is_withdraw;
  }

  get createdAt(): Date {
    return this._commissionRefLogModel.createdAt;
  }
}
