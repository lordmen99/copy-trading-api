import IRealUserModel from '@src/models/cpRealUser/IRealUserModel';
import RealUserSchema from '@src/schemas/RealUserSchema';
import {RepositoryBase} from './base';

export default class RealUserRepository extends RepositoryBase<IRealUserModel> {
  constructor() {
    super(RealUserSchema);
  }
}
