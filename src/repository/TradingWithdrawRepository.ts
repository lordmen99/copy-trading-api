import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import WithdrawHistorySchema from '@src/schemas/WithdrawHistorySchema';
import {RepositoryBase} from './base';

export default class TradingWithdrawRepository extends RepositoryBase<ITradingWithdrawModel> {
  constructor() {
    super(WithdrawHistorySchema);
  }
}
