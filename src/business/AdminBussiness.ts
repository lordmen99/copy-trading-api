import IAdminModel from '@src/models/cpAdmin/IAdminModel';
import AdminRepository from '@src/repository/AdminRepository';
import {security} from '@src/utils';
import {AddAdmin} from '@src/validator/admins/admins.validator';
import {validate} from 'class-validator';

export default class AdminBussiness {
  private _adminRepository: AdminRepository;

  constructor() {
    this._adminRepository = new AdminRepository();
  }

  public async createAdmin(admin: AddAdmin): Promise<IAdminModel> {
    try {
      const errors = await validate(admin);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const securityPass = security.createHashedSalt(admin.password);

        const adminEntity = admin as IAdminModel;
        adminEntity.hashed_password = securityPass.hashedPassword;
        adminEntity.salt = securityPass.salt;

        const result = await this._adminRepository.create(adminEntity);
        if (result) {
          return {
            _id: result._id,
            fullname: result.fullname,
            username: result.username,
            email: result.email,
            avatar: result.avatar,
            phone: result.phone,
            status: result.status,
          } as IAdminModel;
        }
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
}
