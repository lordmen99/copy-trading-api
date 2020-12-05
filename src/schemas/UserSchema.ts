import IUserModel from '@src/models/cpUser/IUserModel';
import mongoose, {Schema} from 'mongoose';
class UserSchema {
  static get schema() {
    const schema = new mongoose.Schema({
      full_name: {type: String, default: ''},
      username: {type: String, required: true, unique: true},
      email: {type: String, index: true, required: true, unique: true},
      password: {type: String, required: true},
      email_verify_at: {type: Date, required: false, default: null},
      phone: {type: String},
      country_id: {type: Schema.Types.ObjectId, required: false},
      amount: {type: Schema.Types.Decimal128, required: false, default: 0},
      is_ib: {type: Boolean, required: false, default: false},
      buy_ib_at: {type: Date, required: false, default: null},
      commission_ib: {type: Number, required: false},
      commission_ref: {type: Number, required: false},
      commission_matrix: {type: Number, required: false},
      commission_botAI: {type: Number, required: false},
      is_root_sponsor: {type: Boolean, required: false, default: false},
      sponsor_id: {type: Schema.Types.ObjectId, ref: 'users'},
      sponsor_path: [{type: Schema.Types.ObjectId, ref: 'users'}],
      withdraw_blocked_at: {type: Date, required: false},
      login_blocked_at: {type: Date, required: false},
      tfa_secret: {type: String, required: false, default: null},
      is_tfa_enabled: {type: Boolean, required: false, default: false},
      verify_code: {type: String, required: false, default: null},
      main_acc_id: {type: Schema.Types.ObjectId, ref: 'users'},
      is_fake_user: {type: Boolean, required: false, default: false},
      token: {type: String},
      blockedAt: {type: Date, required: false},
      eth_address: {type: String, required: false, default: null},
      eth_address_password: {type: String, required: false, default: null},
      eth_address_seed: {type: String, required: false, default: null},
      eth_address_private_key: {type: String, required: false, default: null},
      deposits: [{type: Schema.Types.ObjectId, ref: 'Deposit'}],
      withdraws: [{type: Schema.Types.ObjectId, ref: 'Withdraw'}],
      is_auto_upgrade_matrix: {type: Boolean, required: false, default: true},
      matrix_package_ids: [{type: Schema.Types.ObjectId, required: false, ref: 'matrix_packages'}],
      matrix_withdraw_back: {type: Number, required: false, default: 0},
      login_code: {type: String, required: false, default: null},
      verify_failed: {type: Number, required: false, default: 0},
      login_code_lastest: {type: Date, required: false, default: null},
      receivedBonusAt: {type: Date, required: false, default: null},
      showBonusAt: {type: Date, required: false, default: null},
    });
    return schema;
  }
}

export default mongoose.model<IUserModel>('user', UserSchema.schema);
