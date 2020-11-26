import UserBussiness from '@src/business/UserBussiness';
import {logger} from '@src/middleware';
import IUserModel from '@src/models/cpUser/IUserModel';
import {contants} from '@src/utils';
import {AddUser} from '@src/validator/users/users.validator';

export default () => {
  try {
    const userBusiness = new UserBussiness();
    const faker = require('faker');
    const fullname = faker.name.findName();
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const phone = faker.phone.phoneNumber();
    const total_amount = faker.finance.amount();

    const data = new AddUser();

    data.fullname = fullname;
    data.username = username;
    data.email = email;
    data.phone = phone;
    data.total_amount = total_amount;
    data.is_virtual = true;
    data.status = contants.STATUS.ACTIVE;

    const userEntity = data as IUserModel;

    userBusiness.addUser(userEntity);
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
