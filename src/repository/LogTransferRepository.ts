import ILogTransferModel from '@src/models/cpLogTransfer/ILogTransferModel';
import CPLogTransferSchema from '@src/schemas/CPLogTransferSchema';
import {RepositoryBase} from './base';

export default class LogTransferRepository extends RepositoryBase<ILogTransferModel> {
  constructor() {
    super(CPLogTransferSchema);
  }
}
