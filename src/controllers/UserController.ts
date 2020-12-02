import UserBussiness from '@src/business/UserBussiness';
import IUserModel from '@src/models/cpUser/IUserModel';
import {contants} from '@src/utils';
import {AddUser, EditUser, GetUser} from '@src/validator/users/users.validator';
import {NextFunction, Request, Response} from 'express';

export default class UserController {
  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const id = (req.user as IUserModel).id;
      const params = req.query;
      const userBusiness = new UserBussiness();
      const data = new GetUser();
      data._id = params._id.toString();
      const result = await userBusiness.findById(data);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getListUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userBusiness = new UserBussiness();
      const result = await userBusiness.getListUsers();
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async addUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new AddUser();
      data.fullname = params.fullname;
      data.username = params.username;
      data.email = params.email;
      data.phone = params.phone;
      data.avatar = params.avatar;
      data.total_amount = params.total_amount;
      data.is_virtual = params.is_virtual;
      data.status = contants.STATUS.ACTIVE;
      data.status_trading_copy = contants.STATUS.ACTIVE;
      const userBusiness = new UserBussiness();
      const result = await userBusiness.addUser(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async autoGenerateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      if (!params.number) {
        throw new Error('Number is required');
      } else {
        const userBusiness = new UserBussiness();
        const faker = require('faker');

        for (let i = 0; i < params.number; i++) {
          const fullname = faker.name.findName();
          const username = faker.internet.userName();
          const email = faker.internet.email();
          const phone = faker.phone.phoneNumber();
          const total_amount = faker.finance.amount();

          const data = new AddUser();

          data.fullname = fullname;
          data.username = username;
          data.email = email;
          data.phone = phone;
          data.avatar = '';
          data.total_amount = total_amount;
          data.is_virtual = true;
          data.status = contants.STATUS.ACTIVE;
          data.status_trading_copy = contants.STATUS.ACTIVE;
          const userEntity = data as IUserModel;
          userBusiness.addUser(userEntity);
        }
      }

      res.status(200).send({data: true});
    } catch (err) {
      next(err);
    }
  }

  public async editUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new EditUser();
      data._id = params._id;
      data.fullname = params.fullname;
      data.username = params.username;
      data.email = params.email;
      data.phone = params.phone;
      data.avatar = params.avatar;
      data.total_amount = params.total_amount;
      data.is_virtual = params.is_virtual;
      const userBusiness = new UserBussiness();
      const result = await userBusiness.editUser(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
