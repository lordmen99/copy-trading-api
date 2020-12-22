import TradingOrderBussiness from '@src/business/TradingOrderBussiness';
import IAdminModel from '@src/models/cpAdmin/IAdminModel';
import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import {contants} from '@src/utils';
import {
  CreateTradingOrder,
  DeleteTradingOrder,
  EditTradingOrder,
} from '@src/validator/trading_orders/trading_orders.validator';
import {NextFunction, Request, Response} from 'express';
import moment from 'moment-timezone';

export default class TradingOrderController {
  public async getTradingOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (req.user as ITradingOrderModel).id;
      const tradingCopyBusiness = new TradingOrderBussiness();
      const result = await tradingCopyBusiness.findById(id);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getListTradingOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const tradingOrderBusiness = new TradingOrderBussiness();
      const result = await tradingOrderBusiness.getListOrders(
        params.status,
        params.page,
        params.size,
        params.fromDate,
        params.toDate,
      );
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getListTradingOrdersByExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const tradingOrderBusiness = new TradingOrderBussiness();
      const result = await tradingOrderBusiness.getListOrdersByExpert(params.id_expert, params.page, params.size);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async createTradingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      /** timezone của người đặt lệnh */
      const timeZone = params.time_zone;
      /** chuyển time start lệnh sang định dạng utc */
      const orderTime = new Date(moment.tz(params.orderedAt, timeZone).toString());
      /** chuyển cuối ngày theo timezone người đặt lệnh sang utc */
      const endTime = new Date(moment.tz(params.orderedAt, timeZone).endOf('day').toString());
      const data = new CreateTradingOrder();
      data.id_expert = params.id_expert;
      data.id_admin = (req.user as IAdminModel)._id;
      data.type_of_order = params.type_of_order;
      data.threshold_percent = params.threshold_percent;
      data.status = contants.STATUS.PENDING;
      data.orderedAt = orderTime;
      data.createdAt = orderTime;
      const diff = Math.round((endTime.getTime() - orderTime.getTime()) * Math.random());
      data.timeSetup = new Date(orderTime.getTime() + diff);
      const tradingOrderBusiness = new TradingOrderBussiness();
      const result = await tradingOrderBusiness.createTradingOrder(data);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async editTradingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      /** timezone của người đặt lệnh */
      const timeZone = params.time_zone;

      const data = new EditTradingOrder();
      data.id_order = params.id_order;
      data.id_expert = params.id_expert;
      data.id_admin = (req.user as IAdminModel)._id;
      data.type_of_order = params.type_of_order;
      data.threshold_percent = params.threshold_percent;
      data.status = contants.STATUS.PENDING;
      data.timeSetup = new Date(moment.tz(params.timeSetup, timeZone).toString());

      const tradingOrderBusiness = new TradingOrderBussiness();
      const result = await tradingOrderBusiness.editTradingOrder(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async deleteTradingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new DeleteTradingOrder();
      data.id_order = params.id_order;

      const tradingOrderBusiness = new TradingOrderBussiness();
      const result = await tradingOrderBusiness.deleteTradingOrder(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
