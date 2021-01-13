import ICommissionRefLogModel from '@src/models/cpCommissionRefLogs/ICommissionRefLogModel';
import CPCommissionRefLogSchema from '@src/schemas/CPCommissionRefLogSchema';
import {RepositoryBase} from './base';

export default class CommissionRefLogRepository extends RepositoryBase<ICommissionRefLogModel> {
  constructor() {
    super(CPCommissionRefLogSchema);
  }

  public async insertManyCommissionRefLog(arrCommissionRefLog: ICommissionRefLogModel[]) {
    try {
      const result = await CPCommissionRefLogSchema.insertMany(arrCommissionRefLog);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
