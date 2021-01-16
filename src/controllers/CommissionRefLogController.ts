import ComissionRefLogBussiness from '@src/business/CommissionRefLogBussiness';
import IUserModel from '@src/models/cpUser/IUserModel';
import {NextFunction, Request, Response} from 'express';

export default class ComissionRefLogController {
  public async getComissionOfUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const id_user = (req.user as IUserModel).id;
      // const id_user = params.id_user;
      const ComissionRefLogBusiness = new ComissionRefLogBussiness();
      const result = await ComissionRefLogBusiness.getComissionOfUser(
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
}
