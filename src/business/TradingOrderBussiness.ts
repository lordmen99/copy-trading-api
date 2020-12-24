import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import BlockRepository from '@src/repository/BlockRepository';
import ExpertRepository from '@src/repository/ExpertRepository';
import SymbolRepository from '@src/repository/SymbolRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import TradingOrderRepository from '@src/repository/TradingOrderRepository';
import TradingWithdrawRepository from '@src/repository/TradingWithdrawRepository';
import {contants} from '@src/utils';
import {CreateTradingHistory} from '@src/validator/trading_histories/trading_histories.validator';
import {
  CreateTradingOrder,
  DeleteTradingOrder,
  EditTradingOrder,
} from '@src/validator/trading_orders/trading_orders.validator';
import {validate} from 'class-validator';
import moment from 'moment';
import {Schema} from 'mongoose';
import TradingCopyBussiness from './TradingCopyBussiness';
import TradingHistoryBussiness from './TradingHistoryBussiness';

export default class TradingOrderBussiness {
  private _tradingOrderRepository: TradingOrderRepository;
  private _tradingHistoryRepository: TradingHistoryRepository;
  private _expertRepository: ExpertRepository;
  private _tradingCopyRepository: TradingCopyRepository;
  private _tradingWithdrawRepository: TradingWithdrawRepository;
  private _blockRepository: BlockRepository;
  private _symbolRepository: SymbolRepository;

  constructor() {
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
    this._tradingOrderRepository = new TradingOrderRepository();
    this._tradingHistoryRepository = new TradingHistoryRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
    this._blockRepository = new BlockRepository();
    this._symbolRepository = new SymbolRepository();
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

  public async getListOrders(
    status: string,
    page: number,
    size: number,
    fromDate: Date,
    toDate: Date,
    action: string,
  ): Promise<ITradingOrderModel[]> {
    try {
      const result = await this._tradingOrderRepository.getListOrders(status, page, size, fromDate, toDate, action);
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async getListOrdersByExpert(
    id_expert: Schema.Types.ObjectId,
    status: string,
    page: number,
    size: number,
    fromDate: Date,
    toDate: Date,
    action: string,
    time_zone: string,
  ): Promise<ITradingOrderModel[]> {
    try {
      const result = await this._tradingOrderRepository.getListOrdersByExpert(
        id_expert,
        status,
        page,
        size,
        fromDate,
        toDate,
        action,
        time_zone,
      );
      if (result) return result;
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async executeListPendingOrders(date: Date): Promise<void> {
    try {
      const result = await this._tradingOrderRepository.findWhereSortByField(
        {
          status: contants.STATUS.PENDING,
          timeSetup: {$lt: date},
        },
        'timeSetup',
      );
      if (result.length <= 0) return;
      for (let i = 0; i <= result.length - 1; i++) {
        const item = result[i];
        if (i !== result.length - 1) {
          /** nếu có nhiều lệnh thì di chuyển các lệnh khác lệnh cuối cùng sang một thời gian khác */
          const start = new Date();
          const end = new Date(item.endDate);
          /** compare time giữa ngày start và end */
          const compareTime = moment(start).diff(moment(end), 'seconds');
          /** nếu ngày start nhỏ hơn ngày kết thúc thì tăng thêm giờ trong khoảng thời gian đến hết ngày */
          if (compareTime <= 0) {
            const diffES = Math.round((end.getTime() - start.getTime()) * Math.random());
            const newDate = new Date(start.getTime() + diffES);
            this._tradingOrderRepository.update(item._id, {
              timeSetup: newDate,
            });
          }
        } else {
          const timeSetup = moment(item.timeSetup).format('YYYY-MM-DD HH:mm:00');
          const fromTime = moment(timeSetup).subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:00');
          const toDate = moment(timeSetup).subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:30');
          const blocks = await this._blockRepository.findWhere({
            createdAt: {
              $gt: new Date(fromTime),
              $lt: new Date(toDate),
            },
          });
          if (blocks.length === 3) {
            const blockIds = blocks.map((item) => item.block_id);
            const symbols = await this._symbolRepository.getListSymbols(blockIds);
            if (symbols.length === 3) {
              const dataSocket = {
                date: symbols[1].createdAt,
                open: symbols[0].close_price,
                close: symbols[2].open_price,
                high: symbols[1].high_price,
                low: symbols[1].low_price,
                volume: symbols[1].volume,
                is_open: symbols[1].open,
              };

              // khớp thời gian đánh lệnh, chuyển trạng thái order về FINISH
              this._tradingOrderRepository.update(item._id, {status: contants.STATUS.FINISH});

              /** khởi tạo time vào lệnh cho cả chuyên gia và user */
              let secondOpen = Math.floor(Math.random() * (29 - 1) + 1).toString();
              secondOpen = secondOpen.length === 1 ? `0${secondOpen}` : secondOpen;
              console.log(dataSocket.date, ': dataSocket.date');
              const timeOpening = new Date(moment(dataSocket.date).format(`YYYY-MM-DD HH:mm:${secondOpen}`));
              console.log(timeOpening.toString(), ': timeOpening.toString()');

              // tạo history cho expert
              const expert = await this._expertRepository.findById(item.id_expert.toString());
              if (expert) this.createHistoryForExpert(item, dataSocket, expert, timeOpening);

              // tạo histories cho user copy
              const tradingCopy = await this._tradingCopyRepository.findWhere({
                status: contants.STATUS.ACTIVE,
                id_expert: item.id_expert,
              });
              if (tradingCopy) this.createHistoryForUserCopy(item, dataSocket, tradingCopy, timeOpening);
            }
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
        });
        if (order) {
          const tradingOrderEntity = tradingOrder as ITradingOrderModel;
          tradingOrderEntity.id_expert = tradingOrder.id_expert;
          tradingOrderEntity.type_of_order = tradingOrder.type_of_order;
          tradingOrderEntity.threshold_percent = tradingOrder.threshold_percent;
          tradingOrderEntity.timeSetup = tradingOrder.timeSetup;

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

  public async deleteTradingOrder(tradingOrder: DeleteTradingOrder): Promise<boolean> {
    try {
      const errors = await validate(tradingOrder);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const order = await this._tradingOrderRepository.findOne({
          _id: tradingOrder.id_order,
          status: contants.STATUS.PENDING,
        });
        if (order) {
          const tradingOrderEntity = tradingOrder as ITradingOrderModel;
          tradingOrderEntity.status = contants.STATUS.DELETE;

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

  private async createHistoryForExpert(order: any, dataSocket: any, expert: any, timeOpening: Date): Promise<void> {
    try {
      const tradingCopyBussiness = new TradingCopyBussiness();
      const data = new CreateTradingHistory();
      if (expert) {
        const tradingHistoryEntity = data as ITradingHistoryModel;
        tradingHistoryEntity.id_user = null;
        tradingHistoryEntity.id_expert = order.id_expert;
        tradingHistoryEntity.id_order = null;
        tradingHistoryEntity.id_copy = null;

        tradingHistoryEntity.opening_time = timeOpening;
        tradingHistoryEntity.closing_time = timeOpening;
        if (dataSocket.open > dataSocket.close)
          tradingHistoryEntity.type_of_order = order.type_of_order === 'WIN' ? 'SELL' : 'BUY';
        else tradingHistoryEntity.type_of_order = order.type_of_order === 'WIN' ? 'BUY' : 'SELL';
        tradingHistoryEntity.opening_price = dataSocket.open;
        tradingHistoryEntity.closing_price = dataSocket.close;
        const order_amount = parseInt((expert.total_amount * (order.threshold_percent / 100)).toString());
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

  private async createHistoryForUserCopy(
    order: ITradingOrderModel,
    dataSocket: any,
    tradingCopy: ITradingCopyModel[],
    timeOpening: Date,
  ): Promise<void> {
    try {
      const dataTradingHistory: ITradingHistoryModel[] = [];
      const dataCalculateMoney: {id_copy: Schema.Types.ObjectId; money: number}[] = [];
      const dataTradingWithdraw: ITradingWithdrawModel[] = [];
      const dataPauseCopy: Schema.Types.ObjectId[] = [];

      tradingCopy.map(async (copy: ITradingCopyModel) => {
        // tạo history
        const data = new CreateTradingHistory();
        const historyModel = data as ITradingHistoryModel;
        historyModel.id_user = copy.id_user;
        historyModel.id_expert = order.id_expert;
        historyModel.id_order = order._id;
        historyModel.id_copy = copy._id;
        historyModel.opening_time = timeOpening;
        historyModel.closing_time = timeOpening;
        historyModel.opening_price = dataSocket.open;
        historyModel.closing_price = dataSocket.close;
        historyModel.type_of_money = 'BTC/USDT';
        historyModel.status = false;

        if (dataSocket.open > dataSocket.close)
          historyModel.type_of_order = order.type_of_order === 'WIN' ? 'SELL' : 'BUY';
        else historyModel.type_of_order = order.type_of_order === 'WIN' ? 'BUY' : 'SELL';

        if (copy.investment_amount > copy.base_amount || copy.investment_amount === copy.base_amount)
          historyModel.investment_amount = copy.base_amount;
        else historyModel.investment_amount = copy.investment_amount;

        const threshold_percent_amount = parseInt(
          (historyModel.investment_amount * (order.threshold_percent / 100)).toString(),
        );
        const maximum_rate_amount = parseFloat((historyModel.investment_amount * (copy.maximum_rate / 100)).toFixed(2));

        let money = 0;
        if (order.type_of_order === 'WIN') {
          if (copy.has_maximum_rate) {
            if (copy.maximum_rate > order.threshold_percent) {
              historyModel.order_amount = threshold_percent_amount;
              historyModel.profit = threshold_percent_amount;
            } else {
              historyModel.order_amount = maximum_rate_amount;
              historyModel.profit = maximum_rate_amount;
            }
            historyModel.fee_to_expert = parseFloat((historyModel.profit * 0.05).toFixed(2));
            historyModel.fee_to_trading = parseFloat((historyModel.profit * 0.05).toFixed(2));
          } else {
            historyModel.order_amount = threshold_percent_amount;
            historyModel.profit = threshold_percent_amount;
            historyModel.fee_to_expert = parseFloat((historyModel.profit * 0.05).toFixed(2));
            historyModel.fee_to_trading = parseFloat((historyModel.profit * 0.05).toFixed(2));
          }
          /** thêm vào tính toán tiền lãi */
          money = historyModel.profit - historyModel.fee_to_trading - historyModel.fee_to_expert;
          dataCalculateMoney.push({
            id_copy: copy._id,
            money,
          });
          /** thêm vào tính toán tiền trả chuyên gia */
          dataTradingWithdraw.push({
            id_user: historyModel.id_user,
            id_expert: copy.id_expert,
            id_copy: copy._id,
            id_order: order._id,
            amount: historyModel.fee_to_expert,
            type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER,
            status: contants.STATUS.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            paidAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
          } as ITradingWithdrawModel);
        } else {
          if (copy.has_maximum_rate) {
            if (copy.maximum_rate > order.threshold_percent) historyModel.order_amount = threshold_percent_amount;
            else historyModel.order_amount = maximum_rate_amount;
          } else {
            historyModel.order_amount = threshold_percent_amount;
          }
          historyModel.profit = 0;
          historyModel.fee_to_expert = 0;
          historyModel.fee_to_trading = 0;
          /** thêm vào tính toán thua lỗ */
          money = historyModel.order_amount * -1;
          dataCalculateMoney.push({
            id_copy: copy._id,
            money,
          });
        }

        /** chạm đến stop loss khi copy */
        const stop_loss =
          copy.investment_amount + money < ((100 - copy.stop_loss) / 100) * copy.base_amount &&
          copy.has_stop_loss === true;

        /** chạm đến take profit khi copy */
        const take_profit =
          copy.investment_amount + money > copy.base_amount &&
          copy.investment_amount + money - copy.base_amount > copy.taken_profit * copy.base_amount &&
          copy.has_taken_profit === true;

        /** thì sẽ tạm dừng copy */
        if (stop_loss || take_profit) {
          dataPauseCopy.push(copy._id);
        }
        dataTradingHistory.push(historyModel);
      });

      /** tính toán số tiền nhận được */
      dataCalculateMoney.map(async (item: {id_copy: Schema.Types.ObjectId; money: number}) => {
        const copy = await this._tradingCopyRepository.findOne({_id: item.id_copy});
        this._tradingCopyRepository.update(copy._id, {
          investment_amount: copy.investment_amount + item.money,
        });
      });

      /** số tiền để sau trả lại chuyên gia nếu thắng */
      this._tradingWithdrawRepository.insertManyTradingWithdraw(dataTradingWithdraw);

      /** dừng copy với những tài khoản chạm stop_loss hoặc take_profit */
      this._tradingCopyRepository.updateManyPauseCopy(dataPauseCopy);

      /** thêm vào lịch sử giao dịch */
      this._tradingHistoryRepository.insertManyTradingHistory(dataTradingHistory);
    } catch (err) {
      throw err;
    }
  }
}
