import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import TradingHistorySchema from '@src/schemas/TradingHistorySchema';
import {RepositoryBase} from './base';

export default class TradingHistoryRepository extends RepositoryBase<ITradingHistoryModel> {
  constructor() {
    super(TradingHistorySchema);
  }
}
