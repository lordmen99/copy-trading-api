import IAdminModel from '@src/models/cpAdmin/IAdminModel';
import AdminRepository from '@src/repository/AdminRepository';
import {security} from '@src/utils';
import {AddAdmin, ChangePasswordAdmin} from '@src/validator/admins/admins.validator';
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

  public async changePasswordAdmin(params: ChangePasswordAdmin): Promise<boolean> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const admin = await this._adminRepository.findById(params._id.toString());
        if (admin) {
          const checked = security.checkPassword(params.current_password, admin.salt, admin.hashed_password);
          if (checked) {
            const securityPass = security.createHashedSalt(params.new_password);
            const result = await this._adminRepository.update(params._id, {
              hashed_password: securityPass.hashedPassword,
              salt: securityPass.salt,
            } as IAdminModel);
            return result ? true : false;
          } else throw new Error('Current password is false');
        } else throw new Error('Account does not exist');
      }
    } catch (err) {
      throw err;
    }
  }
}
