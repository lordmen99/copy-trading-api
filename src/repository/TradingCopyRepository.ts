import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import TradingCopySchema from '@src/schemas/TradingCopySchema';
import {RepositoryBase} from './base';

export default class TradingCopyRepository extends RepositoryBase<ITradingCopyModel> {
  constructor() {
    super(TradingCopySchema);
  }
}
