import {Router} from 'express';
import getWalletInfo from './getWalletInfo';
export default class UserRouter {
  public router: Router = Router();

  constructor() {
    getWalletInfo(this.router);
  }
}
