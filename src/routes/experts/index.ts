import {Router} from 'express';
import addExpert from './AddExpert';
import autoGenerateExpert from './AutoGenerateExpert';
import deleteExpert from './DeleteExpert';
import editExpert from './EditExpert';
import getExpertById from './GetExpertById';
import getExpertByName from './GetExpertByName';
import GetExpertDetailById from './GetExpertDetailById';
import getListExperts from './GetListExperts';
import getListExpertsForUser from './GetListExpertsForUser';

export default class ExpertRouter {
  public router: Router = Router();

  constructor() {
    getListExperts(this.router);
    addExpert(this.router);
    editExpert(this.router);
    deleteExpert(this.router);
    autoGenerateExpert(this.router);
    getExpertById(this.router);
    getExpertByName(this.router);
    GetExpertDetailById(this.router);
    getListExpertsForUser(this.router);
  }
}
