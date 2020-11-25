import IUserModel from './IUserModel';

export default class UserModel {
  private _UserModel: IUserModel;

  constructor(UserModel: IUserModel) {
    this._UserModel = UserModel;
  }
  get fullname(): string {
    return this._UserModel.fullname;
  }

  get username(): string {
    return this._UserModel.username;
  }

  get email(): string {
    return this._UserModel.email;
  }

  get phone(): string {
    return this._UserModel.phone;
  }

  get avatar(): string {
    return this._UserModel.avatar;
  }

  get total_amount(): number {
    return this._UserModel.total_amount;
  }

  get is_virtual(): boolean {
    return this._UserModel.is_virtual;
  }

  get status(): string {
    return this._UserModel.status;
  }
}
