import TradingCopyBussiness from '@src/business/TradingCopyBussiness';
import UserBussiness from '@src/business/UserBussiness';
import {contants} from '@src/utils';
import {
  CreateTradingCopy,
  GetTradingCopy,
  GetTradingCopyOfUser,
  StopTradingCopy,
} from '@src/validator/trading_copies/trading_copies.validator';
import {NextFunction, Request, Response} from 'express';

export default class TradingCopyController {
  public async getUserCopyByExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const userBussiness = new UserBussiness();
      const result = await tradingCopyBusiness.findUserCopyByExpert(params.id_expert);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async createTradingCopy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new CreateTradingCopy();
      data.id_user = params.id_user; // change token
      data.id_expert = params.id_expert;
      data.investment_amount = params.investment_amount;
      data.maximum_rate = params.maximum_rate;
      data.has_maximum_rate = params.has_maximum_rate;
      data.has_stop_loss = params.has_stop_loss;
      data.has_taken_profit = params.has_taken_profit;
      data.stop_loss = params.stop_loss;
      data.taken_profit = params.taken_profit;
      data.status = contants.STATUS.ACTIVE;
      data.createdAt = new Date();
      data.updatedAt = new Date();
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.createTradingCopy(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async stopTradingCopy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new StopTradingCopy();
      data.id_user = params.id_user;
      data.id_copy = params.id_copy;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.stopTradingCopy(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async pauseTradingCopy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new GetTradingCopy();
      data.id_copy = params.id_copy;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.pauseTradingCopy(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getTradingCopyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new GetTradingCopy();
      data.id_copy = params.id_copy;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.getTradingCopyById(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getListTradingCopies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new GetTradingCopyOfUser();
      data.id_user = params.id_user;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.getListTradingCopies(data, params.page, params.size);

      res.status(200).send({data: result.result, count: result.count});
    } catch (err) {
      next(err);
    }
  }
}
