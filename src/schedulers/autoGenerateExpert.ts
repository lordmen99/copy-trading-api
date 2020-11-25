import ExpertBussiness from '@src/business/ExpertBussiness';
import {logger} from '@src/middleware';
import IExpertModel from '@src/models/cpExpert/IExpertModel';
import {AddExpert} from '@src/validator/experts/experts.validator';

export default () => {
  try {
    const expertBusiness = new ExpertBussiness();
    const faker = require('faker');
    let fullname = faker.name.findName();
    let username = faker.internet.userName();
    let email = faker.internet.email();
    let phone = faker.phone.phoneNumber();
    let total_amount = faker.finance.amount();

    const data = new AddExpert();

    data.fullname = fullname;
    data.username = username;
    data.email = email;
    data.phone = phone;
    data.total_amount = total_amount;
    data.is_virtual = true;
    data.status = 'ACTIVE';

    const expertEntity = data as IExpertModel;

    expertBusiness.addExpert(expertEntity);
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
