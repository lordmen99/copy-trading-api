import IRealUserModel from './IRealUserModel';

export default class UserModel {
  private _UserModel: IRealUserModel;

  constructor(UserModel: IRealUserModel) {
    this._UserModel = UserModel;
  }

  get username(): string {
    return this._UserModel.username;
  }

  get total_amount(): number {
    return this._UserModel.total_amount;
  }
}
