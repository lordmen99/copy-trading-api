import ExpertBussiness from '@src/business/ExpertBussiness';
import IExpertModel from '@src/models/cpExpert/IExpertModel';
import {AddExpert, EditExpert} from '@src/validator/experts/experts.validator';
import {NextFunction, Request, Response} from 'express';

export default class ExpertController {
  public async getListExperts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const expertBusiness = new ExpertBussiness();
      const result = await expertBusiness.getListExperts();
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async addExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new AddExpert();
      data.fullname = params.fullname;
      data.username = params.username;
      data.email = params.email;
      data.phone = params.phone;
      data.avatar = params.avatar;
      data.total_amount = params.total_amount;
      data.is_virtual = params.is_virtual;
      data.status = 'ACTIVE';
      const expertBusiness = new ExpertBussiness();
      const result = await expertBusiness.addExpert(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async autoGenerateExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const expertBusiness = new ExpertBussiness();
      const faker = require('faker');

      for (let i = 0; i < params.number; i++) {
        let fullname = faker.name.findName();
        let username = faker.internet.userName();
        let email = faker.internet.email();
        let phone = faker.phone.phoneNumber();
        let total_amount = faker.finance.amount();

        const data = new AddExpert();

        data.fullname = fullname;
        data.username = username;
        data.email = email;
        data.phone = phone;
        data.avatar = '';
        data.total_amount = total_amount;
        data.is_virtual = true;
        data.status = 'ACTIVE';
        const expertEntity = data as IExpertModel;
        expertBusiness.addExpert(expertEntity);
      }

      res.status(200).send({data: true});
    } catch (err) {
      next(err);
    }
  }

  public async editExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new EditExpert();
      data._id = params._id;
      data.fullname = params.fullname;
      data.username = params.username;
      data.email = params.email;
      data.phone = params.phone;
      data.avatar = params.avatar;
      data.total_amount = params.total_amount;
      data.is_virtual = params.is_virtual;
      const expertBusiness = new ExpertBussiness();
      const result = await expertBusiness.editExpert(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async deleteExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const expertBusiness = new ExpertBussiness();
      const result = await expertBusiness.deleteExpert(params._id);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
