import {Router} from 'express';
import addExpert from './AddExpert';
import autoGenerateExpert from './AutoGenerateExpert';
import deleteExpert from './DeleteExpert';
import editExpert from './EditExpert';
import enableAutoGenCopierForExpert from './EnableAutoGenCopierForExpert';
import getExpertById from './GetExpertById';
import getExpertByName from './GetExpertByName';
import GetExpertDetailById from './GetExpertDetailById';
import getListExperts from './GetListExperts';
import getListExpertsForUser from './GetListExpertsForUser';
import getProfitForExpert from './GetProfitForExpert';
import updateRangeAutoCopierForExpert from './UpdateRangeAutoCopierForExpert';
import updateVirtualCopierForExpert from './UpdateVirtualCopierForExpert';

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
    getProfitForExpert(this.router);
    updateVirtualCopierForExpert(this.router);
    updateRangeAutoCopierForExpert(this.router);
    enableAutoGenCopierForExpert(this.router);
  }
}
