import IAccessTokenModel from './IAccessTokenModel';

export default class AccessTokenModel {
  private _AccessTokenModel: IAccessTokenModel;

  constructor(AccessTokenModel: IAccessTokenModel) {
    this._AccessTokenModel = AccessTokenModel;
  }
  get client_id(): string {
    return this._AccessTokenModel.client_id;
  }

  get token(): string {
    return this._AccessTokenModel.token;
  }

  get id_admin(): string {
    return this._AccessTokenModel.id_admin;
  }

  get createdAt(): Date {
    return this._AccessTokenModel.createdAt;
  }

  get updatedAt(): Date {
    return this._AccessTokenModel.updatedAt;
  }
}
