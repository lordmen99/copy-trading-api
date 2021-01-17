import {Router} from 'express';
import getComissionOfUser from './GetComissionOfUser';
export default class UserRouter {
  public router: Router = Router();

  constructor() {
    getComissionOfUser(this.router);
  }
}
