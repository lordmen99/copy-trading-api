import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import TradingOrderRepository from '@src/repository/TradingOrderRepository';
import {contants} from '@src/utils';
import {GetExpert} from '@src/validator/experts/experts.validator';
import {GetTradingCopy} from '@src/validator/trading_copies/trading_copies.validator';
import {CreateTradingHistory} from '@src/validator/trading_histories/trading_histories.validator';
import {CreateTradingOrder, EditTradingOrder} from '@src/validator/trading_orders/trading_orders.validator';
import {validate} from 'class-validator';
import moment from 'moment';
import {Schema} from 'mongoose';
import ExpertBussiness from './ExpertBussiness';
import TradingCopyBussiness from './TradingCopyBussiness';
import TradingHistoryBussiness from './TradingHistoryBussiness';
import TradingWithdrawBussiness from './TradingWithdrawBussiness';
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
            const tradingWithdrawBussiness = new TradingWithdrawBussiness();

            const tradingCopy = await tradingCopyBussiness.getTradingCopies(order.id_expert);

            const expertBusiness = new ExpertBussiness();

            const data = new GetExpert();
            data._id = order.id_expert.toString();

            const expert = await expertBusiness.findById(data);
            if (expert) {
              // tạo history cho expert
              const data = new CreateTradingHistory();
              const tradingHistoryEntity = data as ITradingHistoryModel;
              tradingHistoryEntity.id_user = null;
              tradingHistoryEntity.id_expert = order.id_expert;
              tradingHistoryEntity.id_order = null;
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
                tradingHistoryEntity.order_amount = parseFloat(
                  (expert.total_amount * (order.threshold_percent / 100)).toFixed(2),
                );
                tradingHistoryEntity.profit = parseFloat(
                  (expert.total_amount * (order.threshold_percent / 100)).toFixed(2),
                );
                tradingHistoryEntity.fee_to_expert = 0;
                tradingHistoryEntity.fee_to_trading = parseFloat(
                  (tradingHistoryEntity.profit * contants.RATE.FEE_TO_TRADING).toFixed(2),
                );
                await tradingCopyBussiness.calculateMoney(
                  null,
                  tradingHistoryEntity.id_expert,
                  'expert',
                  tradingHistoryEntity.profit -
                    tradingHistoryEntity.fee_to_trading -
                    tradingHistoryEntity.fee_to_expert,
                );
              } else {
                tradingHistoryEntity.order_amount = parseFloat(
                  (expert.total_amount * (order.threshold_percent / 100)).toFixed(2),
                );
                tradingHistoryEntity.profit = 0;
                tradingHistoryEntity.fee_to_expert = 0;
                tradingHistoryEntity.fee_to_trading = 0;
                await tradingCopyBussiness.calculateMoney(
                  null,
                  tradingHistoryEntity.id_expert,
                  'expert',
                  tradingHistoryEntity.investment_amount * -1,
                );
              }

              tradingHistoryEntity.type_of_money = 'BTC/USDT';
              tradingHistoryEntity.status = true;

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
                tradingHistoryEntity.id_order = order._id;
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
                if (copy.investment_amount > copy.base_amount || copy.investment_amount === copy.base_amount) {
                  tradingHistoryEntity.investment_amount = copy.base_amount;
                } else {
                  tradingHistoryEntity.investment_amount = copy.investment_amount;
                }
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
                      tradingHistoryEntity.profit -
                        tradingHistoryEntity.fee_to_trading -
                        tradingHistoryEntity.fee_to_expert,
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
                      tradingHistoryEntity.profit -
                        tradingHistoryEntity.fee_to_trading -
                        tradingHistoryEntity.fee_to_expert,
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
                  if (copy.has_maximum_rate) {
                    await tradingCopyBussiness.calculateMoney(
                      copy._id,
                      tradingHistoryEntity.id_user,
                      'user',
                      tradingHistoryEntity.order_amount * -1,
                    );
                  } else {
                    await tradingCopyBussiness.calculateMoney(
                      copy._id,
                      tradingHistoryEntity.id_user,
                      'user',
                      tradingHistoryEntity.order_amount * -1,
                    );
                  }
                }
                tradingHistoryEntity.type_of_money = 'BTC/USDT';
                tradingHistoryEntity.status = false;

                if (
                  copy.investment_amount < ((100 - copy.stop_loss) / 100) * copy.base_amount &&
                  copy.has_stop_loss === true
                ) {
                  const data = new GetTradingCopy();
                  data.id_copy = copy._id.toString();
                  await tradingCopyBussiness.pauseTradingCopy(data);
                }

                if (copy.investment_amount > copy.taken_profit && copy.has_taken_profit === true) {
                  const data = new GetTradingCopy();
                  data.id_copy = copy._id.toString();
                  await tradingCopyBussiness.pauseTradingCopy(data);
                }
                const tradingHistoryBusiness = new TradingHistoryBussiness();
                await tradingHistoryBusiness.createTradingHistory(tradingHistoryEntity);
              });
            }
          }
        });
      }

      const resultPending = await this._tradingOrderRepository.findWhereSortByField(
        {
          status: contants.STATUS.PENDING,
        } as ITradingOrderModel,
        'timeSetup',
      );

      if (resultPending && resultPending.length > 0) {
        const flagOrder = {
          _id: null,
          id_expert: null,
          id_admin: null,
          type_of_order: '',
          threshold_percent: 0,
          status: '',
          createdAt: new Date(),
          orderedAt: new Date(),
          timeSetup: new Date(),
        };
        let flagDiff = moment(new Date()).diff(moment(resultPending[0].timeSetup), 'minutes');
        resultPending.map(async (order) => {
          const diff = moment(new Date()).diff(moment(order.timeSetup), 'minutes');
          if (diff <= flagDiff && diff > 0) {
            flagDiff = diff;

            flagOrder._id = order._id;
            flagOrder.id_expert = order.id_expert;
            flagOrder.id_admin = order.id_admin;
            flagOrder.type_of_order = order.type_of_order;
            flagOrder.threshold_percent = order.threshold_percent;
            flagOrder.status = order.status;
            flagOrder.createdAt = order.createdAt;
            flagOrder.orderedAt = order.orderedAt;
            flagOrder.timeSetup = order.timeSetup;

            const start = new Date();

            const end = new Date();
            end.setHours(23, 59, 59);
            const diffES = (end.getTime() - start.getTime()) * Math.random();
            await this._tradingOrderRepository.update(order._id, {
              timeSetup: new Date(start.getTime() + diffES),
            } as ITradingOrderModel);
          }
        });

        if (flagOrder._id !== null && flagOrder._id !== '') {
          await this._tradingOrderRepository.update(flagOrder._id, {
            status: contants.STATUS.FINISH,
          } as ITradingOrderModel);

          const tradingCopyBussiness = new TradingCopyBussiness();

          const tradingCopy = await tradingCopyBussiness.getTradingCopies(flagOrder.id_expert);

          const expertBusiness = new ExpertBussiness();

          const data = new GetExpert();
          data._id = flagOrder.id_expert;
          const tempDate = new Date();

          const expert = await expertBusiness.findById(data);
          if (expert) {
            // tạo history cho expert
            const data = new CreateTradingHistory();
            const tradingHistoryEntity = data as ITradingHistoryModel;
            tradingHistoryEntity.id_user = null;
            tradingHistoryEntity.id_expert = flagOrder.id_expert;
            tradingHistoryEntity.id_order = null;
            tradingHistoryEntity.opening_time = tempDate;
            if (dataSocket.open > dataSocket.close) {
              if (flagOrder.type_of_order === 'WIN') {
                tradingHistoryEntity.type_of_order = 'SELL';
              } else {
                tradingHistoryEntity.type_of_order = 'BUY';
              }
            } else {
              if (flagOrder.type_of_order === 'WIN') {
                tradingHistoryEntity.type_of_order = 'BUY';
              } else {
                tradingHistoryEntity.type_of_order = 'SELL';
              }
            }
            tradingHistoryEntity.opening_price = dataSocket.open;
            tradingHistoryEntity.closing_time = tempDate;
            tradingHistoryEntity.closing_price = dataSocket.close;
            tradingHistoryEntity.investment_amount = parseFloat(
              (expert.total_amount * (flagOrder.threshold_percent / 100)).toFixed(2),
            );

            if (flagOrder.type_of_order === 'WIN') {
              tradingHistoryEntity.order_amount = parseFloat(
                (expert.total_amount * (flagOrder.threshold_percent / 100)).toFixed(2),
              );
              tradingHistoryEntity.profit = parseFloat(
                (expert.total_amount * (flagOrder.threshold_percent / 100)).toFixed(2),
              );
              tradingHistoryEntity.fee_to_expert = 0;
              tradingHistoryEntity.fee_to_trading = parseFloat(
                (tradingHistoryEntity.profit * contants.RATE.FEE_TO_TRADING).toFixed(2),
              );
              await tradingCopyBussiness.calculateMoney(
                null,
                tradingHistoryEntity.id_expert,
                'expert',
                tradingHistoryEntity.profit - tradingHistoryEntity.fee_to_trading,
              );
            } else {
              tradingHistoryEntity.order_amount = parseFloat(
                (expert.total_amount * (flagOrder.threshold_percent / 100)).toFixed(2),
              );
              tradingHistoryEntity.profit = 0;
              tradingHistoryEntity.fee_to_expert = 0;
              tradingHistoryEntity.fee_to_trading = 0;
              await tradingCopyBussiness.calculateMoney(
                null,
                tradingHistoryEntity.id_expert,
                'expert',
                tradingHistoryEntity.investment_amount * -1,
              );
            }

            tradingHistoryEntity.type_of_money = 'BTC/USDT';
            tradingHistoryEntity.status = true;

            const tradingHistoryBusiness = new TradingHistoryBussiness();
            await tradingHistoryBusiness.createTradingHistory(tradingHistoryEntity);
          }

          const tradingWithdrawBussiness = new TradingWithdrawBussiness();

          if (tradingCopy) {
            tradingCopy.map(async (copy) => {
              // tạo history
              const data = new CreateTradingHistory();
              const tradingHistoryEntity = data as ITradingHistoryModel;

              tradingHistoryEntity.id_user = copy.id_user;
              tradingHistoryEntity.id_expert = flagOrder.id_expert;
              tradingHistoryEntity.id_order = flagOrder._id;
              tradingHistoryEntity.opening_time = tempDate;
              if (dataSocket.open > dataSocket.close) {
                if (flagOrder.type_of_order === 'WIN') {
                  tradingHistoryEntity.type_of_order = 'SELL';
                } else {
                  tradingHistoryEntity.type_of_order = 'BUY';
                }
              } else {
                if (flagOrder.type_of_order === 'WIN') {
                  tradingHistoryEntity.type_of_order = 'BUY';
                } else {
                  tradingHistoryEntity.type_of_order = 'SELL';
                }
              }
              tradingHistoryEntity.opening_price = dataSocket.open;
              tradingHistoryEntity.closing_time = tempDate;
              tradingHistoryEntity.closing_price = dataSocket.close;
              if (copy.investment_amount > copy.base_amount || copy.investment_amount === copy.base_amount) {
                tradingHistoryEntity.investment_amount = copy.base_amount;
              } else {
                tradingHistoryEntity.investment_amount = copy.investment_amount;
              }
              if (flagOrder.type_of_order === 'WIN') {
                if (copy.has_maximum_rate) {
                  if (copy.maximum_rate > flagOrder.threshold_percent) {
                    tradingHistoryEntity.order_amount = parseFloat(
                      (tradingHistoryEntity.investment_amount * (flagOrder.threshold_percent / 100)).toFixed(2),
                    );
                    tradingHistoryEntity.profit = parseFloat(
                      (tradingHistoryEntity.investment_amount * (flagOrder.threshold_percent / 100)).toFixed(2),
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
                    tradingHistoryEntity.profit -
                      tradingHistoryEntity.fee_to_trading -
                      tradingHistoryEntity.fee_to_expert,
                  );
                  await tradingWithdrawBussiness.createTradingWithdraw({
                    id_user: tradingHistoryEntity.id_user,
                    id_expert: copy.id_expert,
                    id_copy: copy._id,
                    id_order: flagOrder._id,
                    amount: tradingHistoryEntity.fee_to_expert,
                    status: contants.STATUS.PENDING,
                    type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    paidAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
                  } as ITradingWithdrawModel);
                } else {
                  tradingHistoryEntity.order_amount = parseFloat(
                    (tradingHistoryEntity.investment_amount * (flagOrder.threshold_percent / 100)).toFixed(2),
                  );
                  tradingHistoryEntity.profit = parseFloat(
                    (copy.investment_amount * (flagOrder.threshold_percent / 100)).toFixed(2),
                  );
                  tradingHistoryEntity.fee_to_expert = parseFloat((tradingHistoryEntity.profit * 0.05).toFixed(2));
                  tradingHistoryEntity.fee_to_trading = parseFloat((tradingHistoryEntity.profit * 0.05).toFixed(2));
                  await tradingCopyBussiness.calculateMoney(
                    copy._id,
                    tradingHistoryEntity.id_user,
                    'user',
                    tradingHistoryEntity.profit -
                      tradingHistoryEntity.fee_to_trading -
                      tradingHistoryEntity.fee_to_expert,
                  );
                  await tradingWithdrawBussiness.createTradingWithdraw({
                    id_user: tradingHistoryEntity.id_user,
                    id_expert: copy.id_expert,
                    id_copy: copy._id,
                    id_order: flagOrder._id,
                    amount: tradingHistoryEntity.fee_to_expert,
                    type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER,
                    status: contants.STATUS.PENDING,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    paidAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
                  } as ITradingWithdrawModel);
                }
              } else {
                if (copy.has_maximum_rate) {
                  if (copy.maximum_rate > flagOrder.threshold_percent) {
                    tradingHistoryEntity.order_amount = parseFloat(
                      (tradingHistoryEntity.investment_amount * (flagOrder.threshold_percent / 100)).toFixed(2),
                    );
                  } else {
                    tradingHistoryEntity.order_amount = parseFloat(
                      (tradingHistoryEntity.investment_amount * (copy.maximum_rate / 100)).toFixed(2),
                    );
                  }
                } else {
                  tradingHistoryEntity.order_amount = parseFloat(
                    (tradingHistoryEntity.investment_amount * (flagOrder.threshold_percent / 100)).toFixed(2),
                  );
                }
                tradingHistoryEntity.profit = 0;
                tradingHistoryEntity.fee_to_expert = 0;
                tradingHistoryEntity.fee_to_trading = 0;
                if (copy.has_maximum_rate) {
                  await tradingCopyBussiness.calculateMoney(
                    copy._id,
                    tradingHistoryEntity.id_user,
                    'user',
                    tradingHistoryEntity.order_amount * -1,
                  );
                } else {
                  await tradingCopyBussiness.calculateMoney(
                    copy._id,
                    tradingHistoryEntity.id_user,
                    'user',
                    tradingHistoryEntity.order_amount * -1,
                  );
                }
              }
              tradingHistoryEntity.type_of_money = 'BTC/USDT';
              tradingHistoryEntity.status = false;

              if (
                copy.investment_amount < ((100 - copy.stop_loss) / 100) * copy.base_amount &&
                copy.has_stop_loss === true
              ) {
                const data = new GetTradingCopy();
                data.id_copy = copy._id.toString();
                await tradingCopyBussiness.pauseTradingCopy(data);
              }

              if (copy.investment_amount > copy.taken_profit && copy.has_taken_profit === true) {
                const data = new GetTradingCopy();
                data.id_copy = copy._id.toString();
                await tradingCopyBussiness.pauseTradingCopy(data);
              }

              const tradingHistoryBusiness = new TradingHistoryBussiness();
              await tradingHistoryBusiness.createTradingHistory(tradingHistoryEntity);
            });
          }
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
}
