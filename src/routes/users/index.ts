import {Router} from 'express';
import addUser from './AddUser';
import autoGenerateUser from './AutoGenerateUser';
import editUser from './EditUser';
import getListUsers from './GetListUsers';
import getById from './GetUserById';
import getUserByIdAdmin from './GetUserByIdAdmin';
import transferMoney from './TransferMoney';

export default class UserRouter {
  public router: Router = Router();

  constructor() {
    getById(this.router);
    addUser(this.router);
    editUser(this.router);
    getListUsers(this.router);
    autoGenerateUser(this.router);
    getUserByIdAdmin(this.router);
    transferMoney(this.router);
  }
}
