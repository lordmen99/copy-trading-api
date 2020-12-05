import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import CPTradingOrderSchema from '@src/schemas/CPTradingOrderSchema';
import {RepositoryBase} from './base';

export default class TradingOrderRepository extends RepositoryBase<ITradingOrderModel> {
  constructor() {
    super(CPTradingOrderSchema);
  }
}
