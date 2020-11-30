import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import TradingOrderRepository from '@src/repository/TradingOrderRepository';
import {contants} from '@src/utils';
import {GetExpert} from '@src/validator/experts/experts.validator';
import {CreateTradingHistory} from '@src/validator/trading_histories/trading_histories.validator';
import {CreateTradingOrder} from '@src/validator/trading_orders/trading_orders.validator';
import {validate} from 'class-validator';
import ExpertBussiness from './ExpertBussiness';
import TradingCopyBussiness from './TradingCopyBussiness';
import TradingHistoryBussiness from './TradingHistoryBussiness';
export default class TradingOrderBussiness {
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
      const result = await this._tradingOrderRepository.findAll();
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async getListOrdersByExpert(id_expert: string): Promise<ITradingOrderModel[]> {
    try {
      const result = await this._tradingOrderRepository.findWhere({
        id_expert,
      } as ITradingOrderModel);
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
      const result = await this._tradingOrderRepository.findWhereSortByField(
        {
          status: contants.STATUS.PENDING,
        } as ITradingOrderModel,
        'timeSetup',
      );

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

            const tradingCopyBussiness = new TradingCopyBussiness();

            const tradingCopy = await tradingCopyBussiness.getTradingCopies(order.id_expert);

            const expertBusiness = new ExpertBussiness();

            const data = new GetExpert();
            data._id = order.id_expert;

            const expert = await expertBusiness.findById(data);
            if (expert) {
              // tạo history cho expert
              const data = new CreateTradingHistory();
              const tradingHistoryEntity = data as ITradingHistoryModel;
              tradingHistoryEntity.id_user = '';
              tradingHistoryEntity.id_expert = order.id_expert;
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
              tradingHistoryEntity.investment_amount = parseFloat(
                (expert.total_amount * (order.threshold_percent / 100)).toFixed(2),
              );

              if (order.type_of_order === 'WIN') {
                tradingHistoryEntity.profit = parseFloat(
                  (expert.total_amount * (order.threshold_percent / 100)).toFixed(2),
                );
                tradingHistoryEntity.fee_to_expert = parseFloat(
                  (tradingHistoryEntity.profit * contants.RATE.FEE_TO_EXPERT).toFixed(2),
                );
                tradingHistoryEntity.fee_to_trading = parseFloat(
                  (tradingHistoryEntity.profit * contants.RATE.FEE_TO_TRADING).toFixed(2),
                );
              } else {
                tradingHistoryEntity.profit = 0;
                tradingHistoryEntity.fee_to_expert = 0;
                tradingHistoryEntity.fee_to_trading = 0;
              }

              tradingHistoryEntity.type_of_money = 'BTC';
              tradingHistoryEntity.status = false;

              const tradingHistoryBusiness = new TradingHistoryBussiness();
              await tradingHistoryBusiness.createTradingHistory(tradingHistoryEntity);
            }

            if (tradingCopy) {
              tradingCopy.map(async (copy) => {
                // tạo history
                const data = new CreateTradingHistory();
                const tradingHistoryEntity = data as ITradingHistoryModel;

                tradingHistoryEntity.id_user = copy.id_user;
                tradingHistoryEntity.id_expert = order.id_expert;
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
                tradingHistoryEntity.investment_amount = copy.investment_amount;
                if (order.type_of_order === 'WIN') {
                  if (copy.has_maximum_rate) {
                    tradingHistoryEntity.profit = parseFloat(
                      (copy.investment_amount * (copy.maximum_rate / 100)).toFixed(2),
                    );
                    tradingHistoryEntity.fee_to_expert = parseFloat((tradingHistoryEntity.profit * 0.05).toFixed(2));
                    tradingHistoryEntity.fee_to_trading = parseFloat((tradingHistoryEntity.profit * 0.05).toFixed(2));
                  } else {
                    tradingHistoryEntity.profit = parseFloat(copy.investment_amount.toFixed(2));
                    tradingHistoryEntity.fee_to_expert = parseFloat((tradingHistoryEntity.profit * 0.05).toFixed(2));
                    tradingHistoryEntity.fee_to_trading = parseFloat((tradingHistoryEntity.profit * 0.05).toFixed(2));
                  }
                } else {
                  tradingHistoryEntity.profit = 0;
                  tradingHistoryEntity.fee_to_expert = 0;
                  tradingHistoryEntity.fee_to_trading = 0;
                }
                tradingHistoryEntity.type_of_money = 'BTC';
                tradingHistoryEntity.status = false;

                const tradingHistoryBusiness = new TradingHistoryBussiness();
                await tradingHistoryBusiness.createTradingHistory(tradingHistoryEntity);
              });
            }
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
