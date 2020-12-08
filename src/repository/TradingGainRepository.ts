import ITradingGainModel from '@src/models/cpTradingGain/ITradingGainModel';
import CPTradingGainSchema from '@src/schemas/CPTradingGainSchema';
import {RepositoryBase} from './base';

export default class TradingGainRepository extends RepositoryBase<ITradingGainModel> {
  constructor() {
    super(CPTradingGainSchema);
  }
}
