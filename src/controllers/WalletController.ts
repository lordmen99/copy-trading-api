import WalletBussiness from '@src/business/WalletBussiness';
import {NextFunction, Request, Response} from 'express';

export default class AdminController {
  public async getWalletInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const walletBusiness = new WalletBussiness();
      const result = await walletBusiness.getWalletInfo();

      res.status(200).send({data: result});
    } catch (err) {
      next(err);
    }
  }
}
