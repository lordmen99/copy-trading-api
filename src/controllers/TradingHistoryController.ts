import TradingHistoryBussiness from '@src/business/TradingHistoryBussiness';
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
      );
      res.status(200).send({data: result.result, count: result.count});
    } catch (err) {
      next(err);
    }
  }

  public async getListTradingHistoriesByExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const tradingHistoryBusiness = new TradingHistoryBussiness();
      const result = await tradingHistoryBusiness.getListTradingHistoriesByExpert(
        params.id_expert.toString(),
        parseInt(params.page.toString()),
        parseInt(params.size.toString()),
      );
      res.status(200).send({data: result.result, count: result.count});
    } catch (err) {
      next(err);
    }
  }
}
