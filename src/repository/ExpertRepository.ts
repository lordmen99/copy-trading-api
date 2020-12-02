import IExpertModel from '@src/models/cpExpert/IExpertModel';
import ExpertSchema from '@src/schemas/ExpertSchema';
import {RepositoryBase} from './base';

export default class ExpertRepository extends RepositoryBase<IExpertModel> {
  constructor() {
    super(ExpertSchema);
  }
}
