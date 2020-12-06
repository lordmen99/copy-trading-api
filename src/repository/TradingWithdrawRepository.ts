import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import CPTradingWithdrawSchema from '@src/schemas/CPTradingWithdrawSchema';
import {RepositoryBase} from './base';

export default class TradingWithdrawRepository extends RepositoryBase<ITradingWithdrawModel> {
  constructor() {
    super(CPTradingWithdrawSchema);
  }
}
