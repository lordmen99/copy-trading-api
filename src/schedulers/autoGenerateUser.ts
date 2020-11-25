import UserBussiness from '@src/business/UserBussiness';
import {logger} from '@src/middleware';
import IUserModel from '@src/models/cpUser/IUserModel';
import {AddUser} from '@src/validator/users/users.validator';

export default () => {
  try {
    const userBusiness = new UserBussiness();
    const faker = require('faker');
    let fullname = faker.name.findName();
    let username = faker.internet.userName();
    let email = faker.internet.email();
    let phone = faker.phone.phoneNumber();
    let total_amount = faker.finance.amount();

    const data = new AddUser();

    data.fullname = fullname;
    data.username = username;
    data.email = email;
    data.phone = phone;
    data.total_amount = total_amount;
    data.is_virtual = true;
    data.status = 'ACTIVE';

    const userEntity = data as IUserModel;

    userBusiness.addUser(userEntity);
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
