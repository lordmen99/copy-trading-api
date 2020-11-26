import ExpertBussiness from '@src/business/ExpertBussiness';
import {logger} from '@src/middleware';
import IExpertModel from '@src/models/cpExpert/IExpertModel';
import {contants} from '@src/utils';
import {AddExpert} from '@src/validator/experts/experts.validator';

export default () => {
  try {
    const expertBusiness = new ExpertBussiness();
    const faker = require('faker');
    const fullname = faker.name.findName();
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const phone = faker.phone.phoneNumber();
    const total_amount = faker.finance.amount();

    const data = new AddExpert();

    data.fullname = fullname;
    data.username = username;
    data.email = email;
    data.phone = phone;
    data.total_amount = total_amount;
    data.is_virtual = true;
    data.status = contants.STATUS.ACTIVE;

    const expertEntity = data as IExpertModel;

    expertBusiness.addExpert(expertEntity);
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
