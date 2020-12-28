import ILogTransferModel from '@src/models/cpLogTransfer/ILogTransferModel';
import CPLogTransferSchema from '@src/schemas/CPLogTransferSchema';
import {RepositoryBase} from './base';

export default class LogTransferRepository extends RepositoryBase<ILogTransferModel> {
  constructor() {
    super(CPLogTransferSchema);
  }
  public async insertManyLogTransfer(arrExpert: ILogTransferModel[]) {
    try {
      const result = await CPLogTransferSchema.insertMany(arrExpert);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
