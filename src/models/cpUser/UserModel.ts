import IUserModel from './IUserModel';

export default class UserModel {
  private _UserModel: IUserModel;

  constructor(UserModel: IUserModel) {
    this._UserModel = UserModel;
  }
  get full_name(): string {
    return this._UserModel.full_name;
  }

  get user_name(): string {
    return this._UserModel.user_name;
  }

  get email(): string {
    return this._UserModel.email;
  }

  get phone(): string {
    return this._UserModel.phone;
  }

  get total_amount(): number {
    return this._UserModel.total_amount;
  }

  get is_admin(): boolean {
    return this._UserModel.is_admin;
  }
}
