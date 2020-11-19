import UserBussiness from '@src/business/UserBussiness';
import IUserModel from '@src/models/cpUser/IUserModel';
import {NextFunction, Request, Response} from 'express';

export default class UserController {
  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (req.user as IUserModel).id;
      const userBusiness = new UserBussiness();
      const result = await userBusiness.findById(id);
      res.status(200).send({data: '111'});
    } catch (err) {
      next(err);
    }
  }
}
