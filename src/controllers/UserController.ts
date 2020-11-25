import UserBussiness from '@src/business/UserBussiness';
import IUserModel from '@src/models/cpUser/IUserModel';
import {AddUser, EditUser} from '@src/validator/users/users.validator';
import {NextFunction, Request, Response} from 'express';

export default class UserController {
  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (req.user as IUserModel).id;
      const userBusiness = new UserBussiness();
      const result = await userBusiness.findById(id);
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
      data.status = 'ACTIVE';
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
      const userBusiness = new UserBussiness();
      const faker = require('faker');

      for (let i = 0; i < params.number; i++) {
        let fullname = faker.name.findName();
        let username = faker.internet.userName();
        let email = faker.internet.email();
        let phone = faker.phone.phoneNumber();
        let total_amount = faker.finance.amount();

        const data = new AddUser();

        data.fullname = fullname;
        data.username = username;
        data.email = email;
        data.phone = phone;
        data.avatar = '';
        data.total_amount = total_amount;
        data.is_virtual = true;
        data.status = 'ACTIVE';
        const userEntity = data as IUserModel;
        userBusiness.addUser(userEntity);
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
