import AdminBussiness from '@src/business/AdminBussiness';
import {contants} from '@src/utils';
import {AddAdmin} from '@src/validator/admins/admins.validator';
import {NextFunction, Request, Response} from 'express';

export default class AdminController {
  public async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new AddAdmin();
      data.fullname = params.fullname;
      data.username = params.username;
      data.password = params.username;
      data.email = params.email;
      data.phone = params.phone;
      data.avatar = params.avatar;
      data.status = contants.STATUS.ACTIVE;
      const adminBusiness = new AdminBussiness();
      const result = await adminBusiness.createAdmin(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
