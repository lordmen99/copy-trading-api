import AdminBussiness from '@src/business/AdminBussiness';
import IAdminModel from '@src/models/cpAdmin/IAdminModel';
import {contants} from '@src/utils';
import {AddAdmin, ChangePasswordAdmin} from '@src/validator/admins/admins.validator';
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

  public async changePasswordAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new ChangePasswordAdmin();
      data._id = (req.user as IAdminModel)._id.toString();
      data.new_password = params.new_password;
      data.current_password = params.current_password;
      const adminBusiness = new AdminBussiness();
      const result = await adminBusiness.changePasswordAdmin(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
