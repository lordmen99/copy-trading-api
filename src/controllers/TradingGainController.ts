import TradingGainBussiness from '@src/business/TradingGainBussiness';
import {NextFunction, Request, Response} from 'express';

export default class TradingCopyController {
  public async updateTradingGain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tradingGainBussiness = new TradingGainBussiness();
      const result = await tradingGainBussiness.updateTradingGain(req.body.date);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async hotfixTradingGainEveryMonth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tradingGainBussiness = new TradingGainBussiness();
      const result = await tradingGainBussiness.hotfixTradingGainEveryMonth(req.body.date);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
