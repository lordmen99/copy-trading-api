import {Router} from 'express';
import changePasswordAdmin from './ChangePasswordAdmin';
export default class UserRouter {
  public router: Router = Router();

  constructor() {
    // createAdmin(this.router);
    changePasswordAdmin(this.router);
  }
}
