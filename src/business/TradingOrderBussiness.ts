import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import BlockRepository from '@src/repository/BlockRepository';
import CommissionRefLogRepository from '@src/repository/CommissionRefLogRespository';
import ExpertRepository from '@src/repository/ExpertRepository';
import RealUserRepository from '@src/repository/RealUserRepository';
import SymbolRepository from '@src/repository/SymbolRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import TradingOrderRepository from '@src/repository/TradingOrderRepository';
import TradingWithdrawRepository from '@src/repository/TradingWithdrawRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants} from '@src/utils';
import {CreateTradingHistory} from '@src/validator/trading_histories/trading_histories.validator';
import {
  CreateTradingOrder,
  DeleteTradingOrder,
  EditTradingOrder,
} from '@src/validator/trading_orders/trading_orders.validator';
import {validate} from 'class-validator';
import _ from 'lodash';
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
  private _tradingWithdrawRepository: TradingWithdrawRepository;
  private _blockRepository: BlockRepository;
  private _symbolRepository: SymbolRepository;
  private _userRepository: UserRepository;
  private _realUserRepository: RealUserRepository;
  private _commissionRefLogRepository: CommissionRefLogRepository;

  constructor() {
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
    this._tradingOrderRepository = new TradingOrderRepository();
    this._tradingHistoryRepository = new TradingHistoryRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
    this._blockRepository = new BlockRepository();
    this._symbolRepository = new SymbolRepository();
    this._userRepository = new UserRepository();
    this._realUserRepository = new RealUserRepository();
    this._commissionRefLogRepository = new CommissionRefLogRepository();
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
          const fromTime = moment(timeSetup).subtract(3, 'minutes').format('YYYY-MM-DD HH:mm:59');
          const toDate = moment(timeSetup).subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:30');
          const blocks = await this._blockRepository.findWhere({
            createdAt: {
              $gte: new Date(fromTime),
              $lte: new Date(toDate),
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
      const dataPauseCopy: ITradingCopyModel[] = [];

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
          copy.investment_amount + money <= ((100 - copy.stop_loss) / 100) * copy.base_amount &&
          copy.has_stop_loss === true;

        /** chạm đến take profit khi copy */
        const take_profit =
          copy.investment_amount + money > copy.base_amount &&
          copy.investment_amount + money >= (copy.taken_profit / 100) * copy.base_amount &&
          copy.has_taken_profit === true;

        /** thì sẽ tạm dừng copy */
        if (stop_loss || take_profit) {
          dataPauseCopy.push(copy);
        }
        dataTradingHistory.push(historyModel);
      });

      /** số tiền để sau trả lại chuyên gia nếu thắng */
      this._tradingWithdrawRepository.insertManyTradingWithdraw(dataTradingWithdraw);

      /** thêm vào lịch sử giao dịch */
      this._tradingHistoryRepository
        .insertManyTradingHistory(dataTradingHistory)
        .then((listTradingHistory: ITradingHistoryModel[]) => {
          /** thêm vào bảng cp_commission_ref_log để tính hoa hồng cho các cấp */
          this.addCommissionRefLogs(listTradingHistory);
        });

      /** tính toán số tiền nhận được */
      this.calculatorAmount(dataCalculateMoney).then(() => {
        /** dừng copy với những tài khoản chạm stop_loss hoặc take_profit */
        if (dataPauseCopy && dataPauseCopy.length > 0) {
          this.autoStopOrder(dataPauseCopy);
        }
      });
    } catch (err) {
      throw err;
    }
  }

  private async autoStopOrder(dataPauseCopy: ITradingCopyModel[]): Promise<void> {
    this.getAllUserCopy(dataPauseCopy).then((result) => {
      this.calculatorTotalAmount(result).then(async (data) => {
        const listNoDup = _.uniqBy(data, 'id_user');
        listNoDup.forEach((noDup, index) => {
          data.forEach((dup) => {
            if (noDup['id_user'] === dup['id_user']) {
              listNoDup[index].totalAmount += dup['listBase'][0].investment_amount;
              if (dup['listKeep'] && dup['listKeep'].length > 0) {
                listNoDup[index].totalAmount -= parseFloat(dup['listKeep'][0].keep_amount.toFixed(2));
              }
            }
          });
        });
        listNoDup.map(async (copyBase) => {
          const user = await this._userRepository.findOne({_id: copyBase.id_user});
          await this._userRepository.update(copyBase.id_user, {
            blockedAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
            status_trading_copy: contants.STATUS.BLOCK,
            total_amount: user.total_amount + copyBase.totalAmount,
          });
        });
      });
    });
  }

  private async calculatorAmount(dataCalculateMoney) {
    return Promise.all(dataCalculateMoney.map((item) => this.updateAmountAsync(item)));
  }

  private async updateAmountAsync(item: {id_copy: Schema.Types.ObjectId; money: number}) {
    const copy = await this._tradingCopyRepository.findOne({_id: item.id_copy});
    await this._tradingCopyRepository.update(copy._id, {
      investment_amount: copy.investment_amount + item.money,
    });
    return Promise.resolve(copy);
  }

  private async getAllUserCopy(dataPauseCopy) {
    return Promise.all(dataPauseCopy.map((item) => this.getUserCopyAsync(item)));
  }

  private async getUserCopyAsync(item) {
    const copy = await this._tradingCopyRepository.findOne({
      _id: item._id,
      id_user: item.id_user,
    });
    return Promise.resolve(copy);
  }

  private async calculatorTotalAmount(dataCalculateMoney) {
    return Promise.all(dataCalculateMoney.map((item) => this.countTotalAmount(item)));
  }

  private async countTotalAmount(copy: ITradingCopyModel) {
    const listBase = [];
    const listKeep = [];
    const isProfit = copy.investment_amount > copy.base_amount ? true : false;
    let keep_amount = 0;
    if (isProfit) {
      const histories = await this._tradingHistoryRepository.findWhere({
        id_copy: copy._id,
        id_user: copy.id_user,
        closing_time: {
          $gte: new Date(new Date().setHours(0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59)),
        },
      });
      if (histories.length > 0) {
        for (const history of histories) {
          if (history.profit === 0) {
            keep_amount = keep_amount - history.order_amount;
          } else {
            keep_amount = keep_amount + history.profit - history.fee_to_expert - history.fee_to_trading;
          }
        }
      }
      if (keep_amount < 0) {
        keep_amount = 0;
      }
      const keep = {
        id_user: copy.id_user,
        keep_amount,
      };

      if (listKeep.length > 0) {
        let check = false;
        for (const item of listKeep) {
          if (item.id_user.toString() === copy.id_user.toString()) {
            check = true;
            item.keep_amount += keep.keep_amount;
          }
        }
        if (check === false) {
          listKeep.push(keep);
        }
      } else {
        listKeep.push(keep);
      }
    }

    if (listBase.length > 0) {
      let check = false;
      for (const item of listBase) {
        if (item.id_user.toString() === copy.id_user.toString()) {
          check = true;
          item.investment_amount += copy.investment_amount;
        }
      }
      if (check === false) {
        listBase.push(copy);
      }
    } else {
      listBase.push(copy);
    }

    const expert = await this._expertRepository.findOne({_id: copy.id_expert});
    await this._expertRepository.findAndUpdateExpert(copy.id_expert, expert.real_copier, contants.STATUS.STOP);
    if (isProfit) {
      await this._tradingCopyRepository.update(copy._id, {
        status: contants.STATUS.STOP,
        updatedAt: new Date(),
      });
    } else {
      await this._tradingCopyRepository.update(copy._id, {
        status: contants.STATUS.STOP,
      });
    }
    const tradingWithdrawBussiness = new TradingWithdrawBussiness();
    if (keep_amount !== 0) {
      await tradingWithdrawBussiness.createTradingWithdraw({
        id_user: copy.id_user,
        id_expert: null,
        id_copy: copy._id,
        amount: parseFloat(keep_amount.toFixed(2)),
        type_of_withdraw: contants.TYPE_OF_WITHDRAW.WITHDRAW,
        status: contants.STATUS.PENDING,
        createdAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
        updatedAt: new Date(),
        paidAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
      } as ITradingWithdrawModel);
    }

    const data = {
      listBase,
      listKeep,
      copy,
      id_user: copy.id_user.toString(),
      totalAmount: 0,
    };
    return Promise.resolve(data);
  }

  private async addCommissionRefLogs(listTradingHistory: ITradingHistoryModel[]) {
    try {
      if (listTradingHistory.length > 0) {
        const commissionRefLogModel = [];
        for (const item of listTradingHistory) {
          const tradingCopy = await this._tradingCopyRepository.findById(item.id_copy.toString());
          if (!tradingCopy) return;
          const user = await this._userRepository.findById(item.id_user.toString());
          if (!user) return;
          const realUser = await this._realUserRepository.findById(user.id_user_trading.toString());
          if (!realUser) return;
          if (!realUser.sponsor_path || realUser.sponsor_path.length <= 0) return;
          realUser.sponsor_path.map((x, index) => {
            commissionRefLogModel.push({
              id_user: realUser.id,
              id_user_ref: x,
              id_copy: item.id_copy,
              id_history: item.id,
              level: index + 1,
              investment_amount: tradingCopy.base_amount,
              amount: item.order_amount,
              is_withdraw: false,
            });
          });
        }
        if (commissionRefLogModel.length > 0)
          this._commissionRefLogRepository.insertManyCommissionRefLog(commissionRefLogModel);
      }
    } catch (err) {
      throw err;
    }
  }
}
