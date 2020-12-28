import TradingCopyBussiness from '@src/business/TradingCopyBussiness';
import IUserModel from '@src/models/cpUser/IUserModel';
import {contants} from '@src/utils';
import {
  CreateTradingCopy,
  GetTradingCopy,
  GetTradingCopyOfUser,
  StopTradingCopy,
  TransferMoneyTradingCopy,
} from '@src/validator/trading_copies/trading_copies.validator';
import {NextFunction, Request, Response} from 'express';

export default class TradingCopyController {
  public async getUserCopyByExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.findUserCopyByExpert(params.id_expert, params.page, params.size);

      res.status(200).send({data: result.result[0].data, count: result.count, finance: result.finance});
    } catch (err) {
      next(err);
    }
  }

  public async getUserStopCopyByExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.findUserStopCopyByExpert(
        params.id_expert,
        params.page,
        params.size,
        params.fromDate,
        params.toDate,
      );

      res.status(200).send({data: result.result[0].data, count: result.count, finance: result.finance});
    } catch (err) {
      next(err);
    }
  }

  public async createTradingCopy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new CreateTradingCopy();
      // data.id_user = params.id_user; // change token
      data.id_user = (req.user as IUserModel).id;
      data.id_expert = params.id_expert;
      data.investment_amount = parseFloat(params.investment_amount.toString());
      data.maximum_rate = params.maximum_rate;
      data.has_maximum_rate = params.has_maximum_rate;
      data.has_stop_loss = params.has_stop_loss;
      data.has_taken_profit = params.has_taken_profit;
      data.stop_loss = params.stop_loss;
      data.taken_profit = params.taken_profit;
      data.status = contants.STATUS.ACTIVE;
      data.createdAt = new Date();
      data.updatedAt = new Date();
      data.base_amount = params.investment_amount;
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
      data.id_user = (req.user as IUserModel).id;
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

  public async resumeTradingCopy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new GetTradingCopy();
      data.id_copy = params.id_copy;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.resumeTradingCopy(data);

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
      // data.id_user = params.id_user;
      data.id_user = (req.user as IUserModel).id;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.getListTradingCopies(data, params.page, params.size);

      res.status(200).send({data: result.result, count: result.count});
    } catch (err) {
      next(err);
    }
  }

  public async getListStopTradingCopies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new GetTradingCopyOfUser();
      // data.id_user = params.id_user;
      data.id_user = (req.user as IUserModel).id;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.getListStopTradingCopies(data, params.page, params.size);

      res.status(200).send({data: result.result, count: result.count});
    } catch (err) {
      next(err);
    }
  }

  public async getListStopTradingCopiesAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new GetTradingCopyOfUser();
      data.id_user = params.id_user;
      // data.id_user = (req.user as IUserModel).id;
      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.getListStopTradingCopies(data, params.page, params.size);

      res.status(200).send({data: result.result, count: result.count});
    } catch (err) {
      next(err);
    }
  }

  public async transferMoneyToTradingCopy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new TransferMoneyTradingCopy();
      data.id_copy = params.id_copy;
      // data.id_user = params.id_user;
      data.id_user = (req.user as IUserModel).id;
      data.amount = params.amount;

      const tradingCopyBusiness = new TradingCopyBussiness();
      const result = await tradingCopyBusiness.transferMoneyToTradingCopy(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
