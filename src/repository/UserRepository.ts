import IUserModel from '@src/models/cpUser/IUserModel';
import UserSchema from '@src/schemas/UserSchema';
import {RepositoryBase} from './base';

export default class UserRepository extends RepositoryBase<IUserModel> {
  constructor() {
    super(UserSchema);
  }
}
