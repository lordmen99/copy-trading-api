import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import TradingOrderRepository from '@src/repository/TradingOrderRepository';
import {CreateTradingOrder} from '@src/validator/trading_orders/trading_orders.validator';
import {validate} from 'class-validator';

export default class TradingCopyBussiness {
  private _tradingOrderRepository: TradingOrderRepository;

  constructor() {
    this._tradingOrderRepository = new TradingOrderRepository();
  }

  public async findById(id: string): Promise<ITradingOrderModel> {
    try {
      const errors = await validate(id);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._tradingOrderRepository.findById(id);
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListOrders(): Promise<ITradingOrderModel[]> {
    try {
      const result = this._tradingOrderRepository.findAll();
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async createTradingOrder(tradingOrder: CreateTradingOrder): Promise<ITradingOrderModel> {
    try {
      const errors = await validate(tradingOrder);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const tradingOrderEntity = tradingOrder as ITradingOrderModel;
        const result = await this._tradingOrderRepository.create(tradingOrderEntity);
        if (result) {
          return result;
        }
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
}
