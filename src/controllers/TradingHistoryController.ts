import TradingHistoryBussiness from '@src/business/TradingHistoryBussiness';
import TradingWithdrawBussiness from '@src/business/TradingWithdrawBussiness';
import IUserModel from '@src/models/cpUser/IUserModel';
import {NextFunction, Request, Response} from 'express';

export default class TradingHistoryController {
  public async getListTradingHistories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const tradingHistoryBusiness = new TradingHistoryBussiness();
      const result = await tradingHistoryBusiness.getListTradingHistories(
        parseInt(params.page.toString()),
        parseInt(params.size.toString()),
      );
      res.status(200).send({data: result.result, count: result.count});
    } catch (err) {
      next(err);
    }
  }

  public async getListTradingHistoriesByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const id_user = (req.user as IUserModel).id;
      // const id_user = params.id_user;
      const tradingHistoryBusiness = new TradingHistoryBussiness();
      const result = await tradingHistoryBusiness.getListTradingHistoriesByUser(
        id_user,
        parseInt(params.page.toString()),
        parseInt(params.size.toString()),
        params.fromDate,
        params.toDate,
      );
      res.status(200).send({data: result.result[0].data, count: result.count, profit: result.profit});
    } catch (err) {
      next(err);
    }
  }

  public async getListTradingHistoriesByUserAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      // const id_user = (req.user as IUserModel).id;
      const id_user = params.id_user;
      const tradingHistoryBusiness = new TradingHistoryBussiness();
      const result = await tradingHistoryBusiness.getListTradingHistoriesByUser(
        id_user,
        parseInt(params.page.toString()),
        parseInt(params.size.toString()),
        params.fromDate,
        params.toDate,
      );
      res.status(200).send({data: result.result[0].data, count: result.count, profit: result.profit});
    } catch (err) {
      next(err);
    }
  }

  public async getListTradingHistoriesByExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const tradingHistoryBusiness = new TradingHistoryBussiness();
      const result = await tradingHistoryBusiness.getListTradingHistoriesByExpert(
        params.id_expert ? params.id_expert.toString() : '',
        params.page ? parseInt(params.page.toString()) : 0,
        params.size ? parseInt(params.size.toString()) : 0,
        params.fromDate,
        params.toDate,
      );
      res.status(200).send({data: result.result[0].data, count: result.count, profit: result.profit});
    } catch (err) {
      next(err);
    }
  }

  public async getListTradingHistoriesFollowExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const tradingHistoryBusiness = new TradingHistoryBussiness();
      const result = await tradingHistoryBusiness.getListTradingHistoriesFollowExpert(
        params.id_expert ? params.id_expert.toString() : '',
        params.page ? parseInt(params.page.toString()) : 0,
        params.size ? parseInt(params.size.toString()) : 0,
        params.fromDate,
        params.toDate,
      );
      res.status(200).send({data: result.result[0].data, count: result.count, profit: result.profit});
    } catch (err) {
      next(err);
    }
  }

  public async hotfix_status(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tradingWithdrawBussiness = new TradingWithdrawBussiness();
      await tradingWithdrawBussiness.hotfixStatus();
      res.status(200).send(true);
    } catch (err) {
      next(err);
    }
  }
}
