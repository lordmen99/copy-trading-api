import {Router} from 'express';
import getById from './GetUserById';

export default class UserRouter {
  public router: Router = Router();

  constructor() {
    getById(this.router);
  }
}
