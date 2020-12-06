import IAdminModel from './IAdminModel';

export default class AdminModel {
  private _adminModel: IAdminModel;

  constructor(AdminModel: IAdminModel) {
    this._adminModel = AdminModel;
  }
  get fullname(): string {
    return this._adminModel.fullname;
  }

  get username(): string {
    return this._adminModel.username;
  }

  get email(): string {
    return this._adminModel.email;
  }

  get phone(): string {
    return this._adminModel.phone;
  }

  get avatar(): string {
    return this._adminModel.avatar;
  }

  get status(): string {
    return this._adminModel.status;
  }
}
