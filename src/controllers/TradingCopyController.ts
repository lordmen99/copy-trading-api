import TradingCopyBussiness from '@src/business/TradingCopyBussiness';
import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import {contants} from '@src/utils';
import {CreateTradingCopy} from '@src/validator/trading_copies/trading_copies.validator';
import {NextFunction, Request, Response} from 'express';

export default class TradingCopyController {
  public async getTradingCopyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (req.user as ITradingCopyModel).id;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.findById(id);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async createTradingCopy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new CreateTradingCopy();
      data.id_user = params.id_user;
      data.id_expert = params.id_expert;
      data.investment_amount = params.investment_amount;
      data.maximum_rate = params.maximum_rate;
      data.stop_loss = params.stop_loss;
      data.taken_profit = params.taken_profit;
      data.status = contants.STATUS.ACTIVE;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.createTradingCopy(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
