import IClientModel from './IClientModel';

export default class ClientModel {
  private _ClientModel: IClientModel;

  constructor(ClientModel: IClientModel) {
    this._ClientModel = ClientModel;
  }
  get client_id(): string {
    return this._ClientModel.client_id;
  }

  get client_secret(): string {
    return this._ClientModel.client_secret;
  }

  get name(): string {
    return this._ClientModel.name;
  }

  get createdAt(): Date {
    return this._ClientModel.createdAt;
  }

  get updatedAt(): Date {
    return this._ClientModel.updatedAt;
  }
}
