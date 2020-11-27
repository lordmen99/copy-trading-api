import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import TradingOrderSchema from '@src/schemas/TradingOrderSchema';
import {RepositoryBase} from './base';

export default class TradingOrderRepository extends RepositoryBase<ITradingOrderModel> {
  constructor() {
    super(TradingOrderSchema);
  }
}
