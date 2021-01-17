import IClientModel from '@src/models/cpClient/IClientModel';
import CPClientSchema from '@src/schemas/CPClientSchema';
import {RepositoryBase} from './base';

export default class ClientRepository extends RepositoryBase<IClientModel> {
  constructor() {
    super(CPClientSchema);
  }
}
