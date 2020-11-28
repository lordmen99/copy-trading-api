import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import TradingOrderRepository from '@src/repository/TradingOrderRepository';
import {contants} from '@src/utils';
import {CreateTradingHistory} from '@src/validator/trading_histories/trading_orders.validator';
import {CreateTradingOrder} from '@src/validator/trading_orders/trading_orders.validator';
import {validate} from 'class-validator';
import TradingHistoryBussiness from './TradingHistoryBussiness';

export default class TradingCopyBussiness {
  private _tradingOrderRepository: TradingOrderRepository;
  private _tradingHistoryRepository: TradingHistoryRepository;

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
      const result = await this._tradingOrderRepository.findAll();
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async executeListPendingOrders(dataSocket: any): Promise<ITradingOrderModel[]> {
    try {
      const result = await this._tradingOrderRepository.findWhere({
        status: contants.STATUS.PENDING,
      } as ITradingOrderModel);

      if (result) {
        result.map(async (order) => {
          const tempDate = new Date();
          if (
            order.timeSetup.getDate() === tempDate.getDate() &&
            order.timeSetup.getMonth() === tempDate.getMonth() &&
            order.timeSetup.getFullYear() === tempDate.getFullYear() &&
            order.timeSetup.getHours() === tempDate.getHours() &&
            order.timeSetup.getMinutes() === tempDate.getMinutes()
          ) {
            // khớp thời gian đánh lệnh, chuyển trạng thái order về FINISH
            await this._tradingOrderRepository.update(order._id, {
              status: contants.STATUS.FINISH,
            } as ITradingOrderModel);

            // tạo history
            const data = new CreateTradingHistory();
            const tradingHistoryEntity = data as ITradingHistoryModel;

            tradingHistoryEntity.id_user = order.id_user.toString();
            tradingHistoryEntity.id_expert = order.id_expert.toString();
            tradingHistoryEntity.opening_time = tempDate;
            if (dataSocket.open > dataSocket.close) {
              if (order.type_of_order === 'WIN') {
                tradingHistoryEntity.type_of_order = 'SELL';
              } else {
                tradingHistoryEntity.type_of_order = 'BUY';
              }
            } else {
              if (order.type_of_order === 'WIN') {
                tradingHistoryEntity.type_of_order = 'BUY';
              } else {
                tradingHistoryEntity.type_of_order = 'SELL';
              }
            }
            tradingHistoryEntity.opening_price = dataSocket.open;
            tradingHistoryEntity.closing_time = tempDate;
            tradingHistoryEntity.closing_price = dataSocket.close;
            tradingHistoryEntity.investment_amount = order.total_amount;
            tradingHistoryEntity.profit = 1;
            tradingHistoryEntity.fee_to_expert = tradingHistoryEntity.profit * 0.05;
            tradingHistoryEntity.fee_to_trading = tradingHistoryEntity.profit * 0.05;
            tradingHistoryEntity.type_of_money = 'BTC';
            tradingHistoryEntity.status = true;

            const tradingHistoryBusiness = new TradingHistoryBussiness();
            await tradingHistoryBusiness.createTradingHistory(tradingHistoryEntity);
          }
        });
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
