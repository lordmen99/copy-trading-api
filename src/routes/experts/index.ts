import {Router} from 'express';
import addExpert from './AddExpert';
import autoGenerateExpert from './AutoGenerateExpert';
import deleteExpert from './DeleteExpert';
import editExpert from './EditExpert';
import getExpertById from './GetExpertById';
import getListExperts from './GetListExperts';

export default class ExpertRouter {
  public router: Router = Router();

  constructor() {
    getListExperts(this.router);
    addExpert(this.router);
    editExpert(this.router);
    deleteExpert(this.router);
    autoGenerateExpert(this.router);
    getExpertById(this.router);
  }
}
