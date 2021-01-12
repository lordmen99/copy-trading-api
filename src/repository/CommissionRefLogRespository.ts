import ICommissionRefLogModel from '@src/models/cpCommissionRefLogs/ICommissionRefLogModel';
import CPCommissionRefLogSchema from '@src/schemas/CPCommissionRefLogSchema';
import {RepositoryBase} from './base';

export default class CommissionRefLogRepository extends RepositoryBase<ICommissionRefLogModel> {
  constructor() {
    super(CPCommissionRefLogSchema);
  }
}
