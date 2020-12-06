import TradingOrderBussiness from '@src/business/TradingOrderBussiness';
import IAdminModel from '@src/models/cpAdmin/IAdminModel';
import ITradingOrderModel from '@src/models/cpTradingOrder/ITradingOrderModel';
import {contants} from '@src/utils';
import {CreateTradingOrder, EditTradingOrder} from '@src/validator/trading_orders/trading_orders.validator';
import {NextFunction, Request, Response} from 'express';

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
      const tradingOrderBusiness = new TradingOrderBussiness();
      const result = await tradingOrderBusiness.getListOrders();
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getListTradingOrdersByExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const tradingOrderBusiness = new TradingOrderBussiness();
      const result = await tradingOrderBusiness.getListOrdersByExpert(params.id_expert);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async createTradingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new CreateTradingOrder();
      data.id_expert = params.id_expert;
      data.id_admin = (req.user as IAdminModel)._id;
      data.type_of_order = params.type_of_order;
      data.threshold_percent = params.threshold_percent;
      data.status = contants.STATUS.PENDING;
      const utc = new Date(params.orderedAt).toUTCString();
      data.orderedAt = new Date(utc);
      data.createdAt = new Date(new Date().toUTCString());

      const start = new Date(params.orderedAt);

      if (
        new Date(data.orderedAt).getDate() !== data.createdAt.getDate() ||
        new Date(data.orderedAt).getMonth() !== data.createdAt.getMonth() ||
        new Date(data.orderedAt).getFullYear() !== data.createdAt.getFullYear()
      ) {
        start.setHours(0, 0, 0);
      }

      const end = new Date(params.orderedAt);

      end.setHours(23, 59, 59);
      const diff = (end.getTime() - start.getTime()) * Math.random();

      data.timeSetup = new Date(start.getTime() + diff);

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
      const data = new EditTradingOrder();
      data.id_order = params.id_order;
      data.id_expert = params.id_expert;
      data.id_admin = (req.user as IAdminModel)._id;
      data.type_of_order = params.type_of_order;
      data.threshold_percent = params.threshold_percent;
      data.status = contants.STATUS.PENDING;
      const utc = new Date(params.orderedAt).toUTCString();
      data.orderedAt = new Date(utc);
      data.createdAt = new Date(new Date().toUTCString());

      const start = new Date(params.orderedAt);

      if (
        new Date(data.orderedAt).getDate() !== data.createdAt.getDate() ||
        new Date(data.orderedAt).getMonth() !== data.createdAt.getMonth() ||
        new Date(data.orderedAt).getFullYear() !== data.createdAt.getFullYear()
      ) {
        start.setHours(0, 0, 0);
      }

      const end = new Date(params.orderedAt);

      end.setHours(23, 59, 59);
      const diff = (end.getTime() - start.getTime()) * Math.random();

      data.timeSetup = new Date(start.getTime() + diff);

      const tradingOrderBusiness = new TradingOrderBussiness();
      const result = await tradingOrderBusiness.editTradingOrder(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
