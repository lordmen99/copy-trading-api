import {Router} from 'express';
import changePasswordAdmin from './ChangePasswordAdmin';
import createAdmin from './CreateAdmin';
export default class UserRouter {
  public router: Router = Router();

  constructor() {
    createAdmin(this.router);
    changePasswordAdmin(this.router);
  }
}
