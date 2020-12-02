import IExpertModel from './IExpertModel';

export default class ExpertModel {
  private _expertModel: IExpertModel;

  constructor(ExpertModel: IExpertModel) {
    this._expertModel = ExpertModel;
  }
  get fullname(): string {
    return this._expertModel.fullname;
  }

  get username(): string {
    return this._expertModel.username;
  }

  get email(): string {
    return this._expertModel.email;
  }

  get phone(): string {
    return this._expertModel.phone;
  }

  get avatar(): string {
    return this._expertModel.avatar;
  }

  get total_amount(): number {
    return this._expertModel.total_amount;
  }

  get is_virtual(): boolean {
    return this._expertModel.is_virtual;
  }

  get status(): string {
    return this._expertModel.status;
  }
}
