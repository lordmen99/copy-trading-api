import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import TradingOrderRepository from '@src/repository/TradingOrderRepository';
import {contants} from '@src/utils';
import {GetTradingCopy} from '@src/validator/trading_copies/trading_copies.validator';
import {CreateTradingHistory} from '@src/validator/trading_histories/trading_histories.validator';
import {CreateTradingOrder, EditTradingOrder} from '@src/validator/trading_orders/trading_orders.validator';
import {validate} from 'class-validator';
import moment from 'moment';
import {Schema} from 'mongoose';
import TradingCopyBussiness from './TradingCopyBussiness';
import TradingHistoryBussiness from './TradingHistoryBussiness';
import TradingWithdrawBussiness from './TradingWithdrawBussiness';
export default class TradingOrderBussiness {
  private _tradingOrderRepository: TradingOrderRepository;
  private _tradingHistoryRepository: TradingHistoryRepository;
  private _expertRepository: ExpertRepository;
  private _tradingCopyRepository: TradingCopyRepository;

  constructor() {
    this._tradingOrderRepository = new TradingOrderRepository();
    this._tradingHistoryRepository = new TradingHistoryRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
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

  public async getListOrdersByExpert(id_expert: Schema.Types.ObjectId): Promise<ITradingOrderModel[]> {
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

  public async executeListPendingOrders(dataSocket: any): Promise<void> {
    try {
      const result = await this._tradingOrderRepository.findWhereSortByField(
        {
          status: contants.STATUS.PENDING,
          timeSetup: {
            $lt: moment(new Date()),
          } as any,
        } as ITradingOrderModel,
        'timeSetup',
      );

      if (result.length <= 0) return;
      for (let i = 0; i <= result.length - 1; i++) {
        if (i !== result.length - 1) {
          const start = new Date();
          const end = new Date();
          end.setHours(23, 59, 59);
          const diffES = (end.getTime() - start.getTime()) * Math.random();
          await this._tradingOrderRepository.update(result[i]._id, {
            timeSetup: new Date(start.getTime() + diffES),
          } as ITradingOrderModel);
        } else {
          // khớp thời gian đánh lệnh, chuyển trạng thái order về FINISH
          await this._tradingOrderRepository.update(result[i]._id, {
            status: contants.STATUS.FINISH,
          } as ITradingOrderModel);

          // tạo history cho expert
          const expert = await this._expertRepository.findById(result[i].id_expert.toString());
          if (expert) this.createHistoryForExpert(result[i], dataSocket, expert);

          // tạo histories cho user copy
          const tradingCopy = await this._tradingCopyRepository.findWhere({
            status: contants.STATUS.ACTIVE,
            id_expert: result[i].id_expert,
          } as ITradingCopyModel);
          if (tradingCopy) this.createHistoryForUserCopy(result[i], dataSocket, tradingCopy);
        }
      }
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

  public async editTradingOrder(tradingOrder: EditTradingOrder): Promise<boolean> {
    try {
      const errors = await validate(tradingOrder);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const order = await this._tradingOrderRepository.findOne({
          _id: tradingOrder.id_order,
          status: contants.STATUS.PENDING,
        } as ITradingOrderModel);
        if (order) {
          const tradingOrderEntity = tradingOrder as ITradingOrderModel;
          tradingOrderEntity.id_expert = tradingOrder.id_expert;
          tradingOrderEntity.type_of_order = tradingOrder.type_of_order;
          tradingOrderEntity.threshold_percent = tradingOrder.threshold_percent;
          tradingOrderEntity.orderedAt = tradingOrder.orderedAt;

          const result = await this._tradingOrderRepository.update(order._id, tradingOrderEntity);
          return result ? true : false;
        } else {
          throw new Error('Order is not exist!');
        }
      }
    } catch (err) {
      throw err;
    }
  }

  private async createHistoryForExpert(order: any, dataSocket: any, expert: any): Promise<void> {
    try {
      const tradingCopyBussiness = new TradingCopyBussiness();
      const data = new CreateTradingHistory();
      if (expert) {
        const tradingHistoryEntity = data as ITradingHistoryModel;
        tradingHistoryEntity.id_user = null;
        tradingHistoryEntity.id_expert = order.id_expert;
        tradingHistoryEntity.id_order = null;
        tradingHistoryEntity.opening_time = new Date();
        if (dataSocket.open > dataSocket.close)
          tradingHistoryEntity.type_of_order = order.type_of_order === 'WIN' ? 'SELL' : 'BUY';
        else tradingHistoryEntity.type_of_order = order.type_of_order === 'WIN' ? 'BUY' : 'SELL';
        tradingHistoryEntity.opening_price = dataSocket.open;
        tradingHistoryEntity.closing_time = new Date();
        tradingHistoryEntity.closing_price = dataSocket.close;
        const order_amount = parseFloat((expert.total_amount * (order.threshold_percent / 100)).toFixed(2));
        tradingHistoryEntity.investment_amount = order_amount;
        tradingHistoryEntity.order_amount = order_amount;
        tradingHistoryEntity.fee_to_expert = 0;
        tradingHistoryEntity.profit = order.type_of_order === 'WIN' ? order_amount : 0;
        tradingHistoryEntity.fee_to_trading =
          order.type_of_order === 'WIN'
            ? parseFloat((tradingHistoryEntity.profit * contants.RATE.FEE_TO_TRADING).toFixed(2))
            : 0;
        await tradingCopyBussiness.calculateMoney(
          null,
          tradingHistoryEntity.id_expert,
          'expert',
          order.type_of_order === 'WIN'
            ? tradingHistoryEntity.profit - tradingHistoryEntity.fee_to_trading - tradingHistoryEntity.fee_to_expert
            : tradingHistoryEntity.investment_amount * -1,
        );
        tradingHistoryEntity.type_of_money = 'BTC/USDT';
        tradingHistoryEntity.status = true;

        const tradingHistoryBusiness = new TradingHistoryBussiness();
        await tradingHistoryBusiness.createTradingHistory(tradingHistoryEntity);
      }
    } catch (err) {
      throw err;
    }
  }

  private async createHistoryForUserCopy(order, dataSocket, tradingCopy): Promise<void> {
    try {
      const dataTradingHistory: ITradingHistoryModel[] = [];
      const tradingCopyBussiness = new TradingCopyBussiness();

      tradingCopy.map(async (copy) => {
        // tạo history
        const data = new CreateTradingHistory();
        const tradingWithdrawBussiness = new TradingWithdrawBussiness();
        const tradingHistoryEntity = data as ITradingHistoryModel;
        tradingHistoryEntity.id_user = copy.id_user;
        tradingHistoryEntity.id_expert = order.id_expert;
        tradingHistoryEntity.id_order = order._id;
        tradingHistoryEntity.opening_time = new Date();

        if (dataSocket.open > dataSocket.close)
          tradingHistoryEntity.type_of_order = order.type_of_order === 'WIN' ? 'SELL' : 'BUY';
        else tradingHistoryEntity.type_of_order = order.type_of_order === 'WIN' ? 'BUY' : 'SELL';

        tradingHistoryEntity.opening_price = dataSocket.open;
        tradingHistoryEntity.closing_time = new Date();
        tradingHistoryEntity.closing_price = dataSocket.close;

        if (copy.investment_amount > copy.base_amount || copy.investment_amount === copy.base_amount)
          tradingHistoryEntity.investment_amount = copy.base_amount;
        else tradingHistoryEntity.investment_amount = copy.investment_amount;

        if (order.type_of_order === 'WIN') {
          if (copy.has_maximum_rate) {
            if (copy.maximum_rate > order.threshold_percent) {
              tradingHistoryEntity.order_amount = parseFloat(
                (tradingHistoryEntity.investment_amount * (order.threshold_percent / 100)).toFixed(2),
              );
              tradingHistoryEntity.profit = parseFloat(
                (tradingHistoryEntity.investment_amount * (order.threshold_percent / 100)).toFixed(2),
              );
            } else {
              tradingHistoryEntity.order_amount = parseFloat(
                (tradingHistoryEntity.investment_amount * (copy.maximum_rate / 100)).toFixed(2),
              );
              tradingHistoryEntity.profit = parseFloat(
                (tradingHistoryEntity.investment_amount * (copy.maximum_rate / 100)).toFixed(2),
              );
            }

            tradingHistoryEntity.fee_to_expert = parseFloat((tradingHistoryEntity.profit * 0.05).toFixed(2));
            tradingHistoryEntity.fee_to_trading = parseFloat((tradingHistoryEntity.profit * 0.05).toFixed(2));
            await tradingCopyBussiness.calculateMoney(
              copy._id,
              tradingHistoryEntity.id_user,
              'user',
              tradingHistoryEntity.profit - tradingHistoryEntity.fee_to_trading - tradingHistoryEntity.fee_to_expert,
            );
            await tradingWithdrawBussiness.createTradingWithdraw({
              id_user: tradingHistoryEntity.id_user,
              id_expert: copy.id_expert,
              id_copy: copy._id,
              id_order: order._id,
              amount: tradingHistoryEntity.fee_to_expert,
              type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER,
              status: contants.STATUS.PENDING,
              createdAt: new Date(),
              updatedAt: new Date(),
              paidAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
            } as ITradingWithdrawModel);
          } else {
            tradingHistoryEntity.order_amount = parseFloat(
              (tradingHistoryEntity.investment_amount * (order.threshold_percent / 100)).toFixed(2),
            );
            tradingHistoryEntity.profit = parseFloat(
              (tradingHistoryEntity.investment_amount * (order.threshold_percent / 100)).toFixed(2),
            );
            tradingHistoryEntity.fee_to_expert = parseFloat((tradingHistoryEntity.profit * 0.05).toFixed(2));
            tradingHistoryEntity.fee_to_trading = parseFloat((tradingHistoryEntity.profit * 0.05).toFixed(2));
            await tradingCopyBussiness.calculateMoney(
              copy._id,
              tradingHistoryEntity.id_user,
              'user',
              tradingHistoryEntity.profit - tradingHistoryEntity.fee_to_trading - tradingHistoryEntity.fee_to_expert,
            );
            await tradingWithdrawBussiness.createTradingWithdraw({
              id_user: tradingHistoryEntity.id_user,
              id_expert: copy.id_expert,
              id_copy: copy._id,
              id_order: order._id,
              amount: tradingHistoryEntity.fee_to_expert,
              status: contants.STATUS.PENDING,
              type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER,
              createdAt: new Date(),
              updatedAt: new Date(),
              paidAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
            } as ITradingWithdrawModel);
          }
        } else {
          if (copy.has_maximum_rate) {
            if (copy.maximum_rate > order.threshold_percent) {
              tradingHistoryEntity.order_amount = parseFloat(
                (tradingHistoryEntity.investment_amount * (order.threshold_percent / 100)).toFixed(2),
              );
            } else {
              tradingHistoryEntity.order_amount = parseFloat(
                (tradingHistoryEntity.investment_amount * (copy.maximum_rate / 100)).toFixed(2),
              );
            }
          } else {
            tradingHistoryEntity.order_amount = parseFloat(
              (tradingHistoryEntity.investment_amount * (order.threshold_percent / 100)).toFixed(2),
            );
          }
          tradingHistoryEntity.profit = 0;
          tradingHistoryEntity.fee_to_expert = 0;
          tradingHistoryEntity.fee_to_trading = 0;
          await tradingCopyBussiness.calculateMoney(
            copy._id,
            tradingHistoryEntity.id_user,
            'user',
            tradingHistoryEntity.order_amount * -1,
          );
        }
        tradingHistoryEntity.type_of_money = 'BTC/USDT';
        tradingHistoryEntity.status = false;

        if (copy.investment_amount < ((100 - copy.stop_loss) / 100) * copy.base_amount && copy.has_stop_loss === true) {
          const data = new GetTradingCopy();
          data.id_copy = copy._id.toString();
          await tradingCopyBussiness.pauseTradingCopy(data);
        }

        if (
          copy.investment_amount > copy.base_amount &&
          copy.investment_amount - copy.base_amount > copy.taken_profit * copy.base_amount &&
          copy.has_taken_profit === true
        ) {
          const data = new GetTradingCopy();
          data.id_copy = copy._id.toString();
          await tradingCopyBussiness.pauseTradingCopy(data);
        }
        dataTradingHistory.push(tradingHistoryEntity);
      });
      await this._tradingHistoryRepository.insertManyTradingHistory(dataTradingHistory);
    } catch (err) {
      throw err;
    }
  }
}
