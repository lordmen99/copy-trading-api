import {Router} from 'express';
import createAdmin from './CreateAdmin';
export default class UserRouter {
  public router: Router = Router();

  constructor() {
    createAdmin(this.router);
  }
}
