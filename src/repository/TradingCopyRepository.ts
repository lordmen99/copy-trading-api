import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import CPTradingCopySchema from '@src/schemas/CPTradingCopySchema';
import {RepositoryBase} from './base';

export default class TradingCopyRepository extends RepositoryBase<ITradingCopyModel> {
  constructor() {
    super(CPTradingCopySchema);
  }
}
