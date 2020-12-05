import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import CPTradingHistorySchema from '@src/schemas/CPTradingHistorySchema';
import {RepositoryBase} from './base';

export default class TradingHistoryRepository extends RepositoryBase<ITradingHistoryModel> {
  constructor() {
    super(CPTradingHistorySchema);
  }
}
