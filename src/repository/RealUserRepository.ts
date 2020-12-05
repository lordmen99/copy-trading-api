import IRealUserModel from '@src/models/cpRealUser/IRealUserModel';
import UserSchema from '@src/schemas/UserSchema';
import {RepositoryBase} from './base';

export default class RealUserRepository extends RepositoryBase<IRealUserModel> {
  constructor() {
    super(UserSchema);
  }
}
