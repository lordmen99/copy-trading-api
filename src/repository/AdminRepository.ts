import IAdminModel from '@src/models/cpAdmin/IAdminModel';
import AdminSchema from '@src/schemas/AdminSchema';
import {RepositoryBase} from './base';

export default class AdminRepository extends RepositoryBase<IAdminModel> {
  constructor() {
    super(AdminSchema);
  }
}
