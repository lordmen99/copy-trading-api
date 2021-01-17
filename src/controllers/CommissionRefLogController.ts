import ComissionRefLogBussiness from '@src/business/CommissionRefLogBussiness';
import { NextFunction, Request, Response } from 'express';

export default class ComissionRefLogController {
  public async getComissionOfUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      // const id_user = params.id_user;
      const ComissionRefLogBusiness = new ComissionRefLogBussiness();
      const result = await ComissionRefLogBusiness.getComissionOfUser(
        params.id_user,
        parseInt(params.page.toString()),
        parseInt(params.size.toString()),
        params.fromDate,
        params.toDate,
      );
      res.status(200).send({
        data: result.result,
        count: result.count,
        totalAmountWithdraw: result.totalAmountWithdraw.toString(),
        totalWithdraw: result.totalWithdraw.toString()
      });;
    } catch (err) {
      next(err);
    }
  }
}
