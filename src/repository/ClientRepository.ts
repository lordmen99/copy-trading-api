import IClientModel from '@src/models/cpClient/IClientModel';
import ClientSchema from '@src/schemas/ClientSchema';
import {RepositoryBase} from './base';

export default class ClientRepository extends RepositoryBase<IClientModel> {
  constructor() {
    super(ClientSchema);
  }
}
