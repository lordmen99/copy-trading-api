import TradingWithdrawBussiness from '@src/business/TradingWithdrawBussiness';
import ILogTransferModel from '@src/models/cpLogTransfer/ILogTransferModel';
import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import IUserModel from '@src/models/cpUser/IUserModel';
import LogTransferRepository from '@src/repository/LogTransferRepository';
import RealUserRepository from '@src/repository/RealUserRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import TradingWithdrawRepository from '@src/repository/TradingWithdrawRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants, security} from '@src/utils';
import {AddUser, EditUser, GetUser, TransferMoneyUser, WalletUser} from '@src/validator/users/users.validator';
import {AvailableWalletUser} from '@src/validator/users/users_money.validator';
import {validate} from 'class-validator';
import {Error} from 'mongoose';

export default class UserBussiness {
  private _userRepository: UserRepository;
  private _realUserRepository: RealUserRepository;
  private _tradingCopyRepository: TradingCopyRepository;
  private _tradingHistoryRepository: TradingHistoryRepository;
  private _tradingWithdrawRepository: TradingWithdrawRepository;
  private _logTransferRepository: LogTransferRepository;

  constructor() {
    this._userRepository = new UserRepository();
    this._realUserRepository = new RealUserRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
    this._tradingHistoryRepository = new TradingHistoryRepository();
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
    this._logTransferRepository = new LogTransferRepository();
  }

  public async findById(params: GetUser): Promise<any> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const result = await this._userRepository.findById(params._id.toString());
        if (!result) {
          const user = await this._realUserRepository.findById(params._id.toString());
          if (user) {
            const result = await this._userRepository.findOne({id_user_trading: user._id});
            return {
              _id: result._id,
              username: result.username,
              total_amount: result.total_amount,
              status: result.status,
              status_trading_copy: result.status_trading_copy,
              avatar: result.avatar,
            };
          } else {
            throw new Error('User is not exist!');
          }
        }
        return {
          _id: result._id,
          fullname: result.fullname,
          username: result.username,
          email: result.email,
          phone: result.phone,
          total_amount: result.total_amount,
          status: result.status,
          status_trading_copy: result.status_trading_copy,
          avatar: result.avatar,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByIdAdmin(params: GetUser): Promise<any> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const result = await this._userRepository.findById(params._id.toString());
        return {
          _id: result._id,
          fullname: result.fullname,
          username: result.username,
          email: result.email,
          phone: result.phone,
          total_amount: result.total_amount,
          status: result.status,
          status_trading_copy: result.status_trading_copy,
          is_virtual: result.is_virtual,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListUsers(page: number, size: number): Promise<IUserModel[]> {
    try {
      const result = await this._userRepository.findWithPagingById(
        {status: contants.STATUS.ACTIVE},
        parseInt(page.toString()),
        parseInt(size.toString()),
      );

      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async addUser(user: AddUser): Promise<IUserModel> {
    try {
      const errors = await validate(user);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const securityPass = security.createHashedSalt(user.password);

        const userEntity = user as IUserModel;
        userEntity.hashed_password = securityPass.hashedPassword;
        userEntity.salt = securityPass.salt;

        const result = await this._userRepository.create(userEntity);
        if (result) {
          return result;
        }
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  public async transferMoney(params: TransferMoneyUser): Promise<boolean> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const result = await this._userRepository.findOne({_id: params.id_user});
        if (result) {
          const wallet = await this._realUserRepository.findOne({_id: result.id_user_trading});
          if (wallet) {
            if (params.source === contants.TYPE_OF_WALLET.WALLET) {
              if (parseFloat(wallet.amount.toString()) >= parseFloat(params.amount.toString())) {
                await this._realUserRepository
                  .update(wallet._id, {
                    amount: parseFloat(wallet.amount.toString()) - parseFloat(params.amount.toString()),
                  })
                  .then(async (res) => {
                    if ((res as any).nModified !== 0) {
                      await this._userRepository
                        .update(result._id, {
                          total_amount:
                            parseFloat(result.total_amount.toString()) + parseFloat(params.amount.toString()),
                        })
                        .then(async (res) => {
                          if ((res as any).nModified !== 0) {
                            const tradingWithdrawBussiness = new TradingWithdrawBussiness();
                            const resultWithdraw = await tradingWithdrawBussiness.createTradingWithdraw({
                              id_user: result._id,
                              id_expert: null,
                              id_copy: null,
                              id_order: null,
                              amount: parseFloat(params.amount.toString()),
                              type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER_TO_COPYTRADE,
                              status: contants.STATUS.FINISH,
                              createdAt: new Date(),
                              updatedAt: new Date(),
                              paidAt: new Date(),
                            } as ITradingWithdrawModel);
                          }
                          return true;
                        });
                    }
                  });
                return false;
              } else {
                throw new Error('Money in wallet is not enough');
              }
            } else if (params.source === contants.TYPE_OF_WALLET.COPY_TRADE) {
              if (parseFloat(result.total_amount.toString()) >= parseFloat(params.amount.toString())) {
                await this._userRepository
                  .update(result._id, {
                    total_amount: parseFloat(result.total_amount.toString()) - parseFloat(params.amount.toString()),
                  })
                  .then(async (res) => {
                    if ((res as any).nModified !== 0) {
                      await this._realUserRepository
                        .update(wallet._id, {
                          amount: parseFloat(wallet.amount.toString()) + parseFloat(params.amount.toString()),
                        })
                        .then(async (res) => {
                          if ((res as any).nModified !== 0) {
                            const tradingWithdrawBussiness = new TradingWithdrawBussiness();
                            const resultWithdraw = await tradingWithdrawBussiness.createTradingWithdraw({
                              id_user: result._id,
                              id_expert: null,
                              id_copy: null,
                              id_order: null,
                              amount: parseFloat(params.amount.toString()),
                              type_of_withdraw: contants.TYPE_OF_WITHDRAW.TRANSFER_TO_WALLET,
                              status: contants.STATUS.FINISH,
                              createdAt: new Date(),
                              updatedAt: new Date(),
                              paidAt: new Date(),
                            } as ITradingWithdrawModel);
                          }
                          return true;
                        });
                    }
                  });
                return false;
              } else {
                throw new Error('Money in wallet is not enough');
              }
            } else {
              throw new Error('The source is not exist!');
            }
          }
        }
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  public async hotfixTransferMoney(): Promise<void> {
    try {
      const listUsers = await this._userRepository.findWhere({
        status: contants.STATUS.ACTIVE,
      });

      for (const user of listUsers) {
        const listCopyTradeWithdraws = await this._tradingWithdrawRepository.calculateWithdrawCopyTradeByUser(user._id);
        const listWalletWithdraws = await this._tradingWithdrawRepository.calculateWithdrawWalletByUser(user._id);
        const listHistories = await this._tradingHistoryRepository.calculateProfitHistory(user._id);
        const listCopies = await this._tradingCopyRepository.calculateCopyAmountByUser(user._id);
        let amountWallet = 0;
        let amountCopyTrade = 0;
        let amountHistory = 0;
        let amountCopy = 0;

        if (listCopyTradeWithdraws.length > 0) amountWallet = listWalletWithdraws[0].amount;
        if (listWalletWithdraws.length > 0) amountCopyTrade = listCopyTradeWithdraws[0].amount;
        if (listHistories.length > 0)
          amountHistory = listHistories[0].profit - listHistories[0].fee_to_expert - listHistories[0].fee_to_trading;
        if (listCopies.length > 0) amountCopy = listCopies[0].investment_amount;
        const result =
          parseFloat(amountCopyTrade.toFixed(2)) -
          parseFloat(amountWallet.toFixed(2)) -
          parseFloat(user.total_amount.toFixed(2)) -
          parseFloat(amountCopy.toFixed(2)) +
          parseFloat(amountHistory.toFixed(2));
        if (result) {
          // const update = await this._userRepository.update(user._id, {
          //   total_amount: user.total_amount + parseFloat(result.toFixed(2)),
          // });
          if (result !== 0)
            await this._logTransferRepository.create({
              username: user.username,
              id_user: user._id,
              total_amount: user.total_amount,
              amount: parseFloat(result.toFixed(2)),
            } as ILogTransferModel);
          // return update ? true : false;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async viewWalletHistory(params: WalletUser, page, size): Promise<boolean> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const result = await this._userRepository.findOne({_id: params.id_user});
        if (result) {
          const tradingWithdrawBussiness = new TradingWithdrawBussiness();

          const resultWithdraw = await tradingWithdrawBussiness.getWalletHistory(result._id, page, size);
          return resultWithdraw;
        } else {
          throw new Error('Money in wallet is not enough');
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAvailableMoney(params: AvailableWalletUser): Promise<boolean> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const result = await this._userRepository.findOne({_id: params.id_user});
        if (result) {
          const tradingWithdrawBussiness = new TradingWithdrawBussiness();

          const resultWithdraw = await tradingWithdrawBussiness.getAvailableMoney(result._id, params.source);
          return resultWithdraw;
        } else {
          throw new Error('Money in wallet is not enough');
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async editUser(params: EditUser): Promise<boolean> {
    try {
      const errors = await validate(params);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const user = await this._userRepository.findById(params._id.toString());
        if (user) {
          const userEntity = user as IUserModel;
          userEntity.fullname = params.fullname;
          userEntity.username = params.username;
          userEntity.email = params.email;
          userEntity.phone = params.phone;
          userEntity.avatar = params.avatar;
          userEntity.total_amount = params.total_amount;
          userEntity.is_virtual = params.is_virtual;

          const result = await this._userRepository.update(params._id, userEntity);

          if (result) {
            return result ? true : false;
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async executeUnblockUser(date: Date): Promise<void> {
    try {
      const result = await this._userRepository.findWhere({
        status_trading_copy: contants.STATUS.BLOCK,
        blockedAt: {
          $lt: date,
        },
      });
      if (result) {
        result.map(async (user) => {
          await this._userRepository.update(user._id, {
            status_trading_copy: contants.STATUS.ACTIVE,
          });
        });
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByName(username: string, page: number, size: number): Promise<IUserModel[]> {
    try {
      return this._userRepository.findWithPagingById(
        {username: {$regex: '.*' + username + '.*'}} as any,
        parseInt(page.toString()),
        parseInt(size.toString()),
      );
    } catch (err) {
      throw err;
    }
  }
}
