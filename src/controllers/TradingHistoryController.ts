import TradingHistoryBussiness from '@src/business/TradingHistoryBussiness';
import ITradingHistoryModel from '@src/models/cpTradingHistory/ITradingHistoryModel';
import {NextFunction, Request, Response} from 'express';

export default class TradingHistoryController {
  public async getTradingHistoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (req.user as ITradingHistoryModel).id;
      const tradingHistoryBusiness = new TradingHistoryBussiness();
      const result = await tradingHistoryBusiness.findById(id);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
