import IAdminModel from './IAdminModel';

export default class UserModel {
  private _AdminModel: IAdminModel;

  constructor(AdminModel: IAdminModel) {
    this._AdminModel = AdminModel;
  }
  get fullname(): string {
    return this._AdminModel.fullname;
  }

  get username(): string {
    return this._AdminModel.username;
  }

  get email(): string {
    return this._AdminModel.email;
  }

  get phone(): string {
    return this._AdminModel.phone;
  }

  get avatar(): string {
    return this._AdminModel.avatar;
  }

  get status(): string {
    return this._AdminModel.status;
  }
}
