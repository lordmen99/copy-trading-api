import TradingHistoryBussiness from '@src/business/TradingHistoryBussiness';
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
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
