import IAdminModel from '@src/models/cpAdmin/IAdminModel';
import CPAdminSchema from '@src/schemas/CPAdminSchema';
import {RepositoryBase} from './base';

export default class AdminRepository extends RepositoryBase<IAdminModel> {
  constructor() {
    super(CPAdminSchema);
  }
}
