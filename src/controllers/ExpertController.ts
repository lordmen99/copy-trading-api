import ExpertBussiness from '@src/business/ExpertBussiness';
import {contants} from '@src/utils';
import {
  AddExpert,
  EditExpert,
  GetExpert,
  GetExpertByName,
  UpdateVirtualCopier,
} from '@src/validator/experts/experts.validator';
import {NextFunction, Request, Response} from 'express';
import {Error} from 'mongoose';

export default class ExpertController {
  public async getListExperts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const expertBusiness = new ExpertBussiness();
      const result = await expertBusiness.getListExpertsPaging(params.username, params.page, params.size);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getListExpertsForUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const expertBusiness = new ExpertBussiness();
      const result = await expertBusiness.getListExpertsPagingForUser(params.page, params.size);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getUserCopyByExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const expertBussiness = new ExpertBussiness();
      const result = await expertBussiness.findUserCopyByExpert(params.id_expert, params.page, params.size);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getExpertById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const id = (req.user as IUserModel).id;
      const params = req.query;
      const expertBusiness = new ExpertBussiness();
      const data = new GetExpert();
      data._id = params._id.toString();
      const result = await expertBusiness.findById(data);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getExpertDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const id = (req.user as IUserModel).id;
      const params = req.body;
      const expertBusiness = new ExpertBussiness();
      const data = new GetExpert();
      data._id = params._id.toString();
      const result = await expertBusiness.getExpertDetails(data);
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async getExpertByName(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const id = (req.user as IUserModel).id;
      const params = req.body;
      const expertBusiness = new ExpertBussiness();
      const data = new GetExpertByName();
      data.username = params.username;
      const result = await expertBusiness.findByName(data, params.page, params.size);
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
      data.password = params.password;
      data.email = params.email;
      data.phone = params.phone;
      data.avatar = params.avatar;
      data.total_amount = params.total_amount;
      data.is_virtual = params.is_virtual;
      data.status = contants.STATUS.ACTIVE;
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
      if (!params.number) {
        throw new Error('Number is required');
      } else {
        const expertBusiness = new ExpertBussiness();
        const result = await expertBusiness.addUserAndFollowExpert(params.number);
        res.status(200).send({data: result});
      }
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
      if (params.is_virtual) {
        data.total_amount = params.total_amount;
      }
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

  public async getProfitForExpert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const expertBusiness = new ExpertBussiness();
      const result = await expertBusiness.getProfitForExpert(
        params.id_expert,
        params.fromDate,
        params.toDate,
        params.type,
      );
      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }

  public async updateVirtualCopier(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.body;
      const data = new UpdateVirtualCopier();
      data.id_expert = params.id_expert;
      data.number = params.number;
      const expertBusiness = new ExpertBussiness();
      const result = await expertBusiness.updateVirtualCopier(data);

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
