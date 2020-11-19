import {Router} from 'express';
import UsersRouter from './users';

class MainRoutes {
  public routers: Router;

  constructor() {
    this.routers = Router();
    this.config();
  }

  private config() {
    this.routers.use('/users', new UsersRouter().router);
  }
}

export default new MainRoutes().routers;
