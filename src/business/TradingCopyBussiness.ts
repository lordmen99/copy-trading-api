import ITradingCopyModel from '@src/models/cpTradingCopy/ITradingCopyModel';
import ITradingWithdrawModel from '@src/models/cpTradingWithdraw/ITradingWithdrawModel';
import ExpertRepository from '@src/repository/ExpertRepository';
import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingHistoryRepository from '@src/repository/TradingHistoryRepository';
import TradingWithdrawRepository from '@src/repository/TradingWithdrawRepository';
import UserRepository from '@src/repository/UserRepository';
import {contants} from '@src/utils';
import {
  CreateTradingCopy,
  GetTradingCopy,
  StopTradingCopy,
  TransferMoneyTradingCopy,
} from '@src/validator/trading_copies/trading_copies.validator';
import {validate} from 'class-validator';
import {Schema} from 'mongoose';
import {GetTradingCopyOfUser} from './../validator/trading_copies/trading_copies.validator';
import TradingWithdrawBussiness from './TradingWithdrawBussiness';

export default class TradingCopyBussiness {
  private _tradingCopyRepository: TradingCopyRepository;
  private _userRepository: UserRepository;
  private _expertRepository: ExpertRepository;
  private _tradingWithdrawRepository: TradingWithdrawRepository;
  private _tradingHistoryRepository: TradingHistoryRepository;

  constructor() {
    this._tradingCopyRepository = new TradingCopyRepository();
    this._userRepository = new UserRepository();
    this._expertRepository = new ExpertRepository();
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
    this._tradingHistoryRepository = new TradingHistoryRepository();
  }

  public async findById(id: string): Promise<ITradingCopyModel> {
    try {
      const errors = await validate(id);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._tradingCopyRepository.findById(id);
      }
    } catch (err) {
      throw err;
    }
  }

  public async updateById(id: string): Promise<ITradingCopyModel> {
    try {
      const errors = await validate(id);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        return this._tradingCopyRepository.findById(id);
      }
    } catch (err) {
      throw err;
    }
  }

  public async findUserCopyByExpert(id_expert: Schema.Types.ObjectId, page: number, size: number): Promise<any> {
    try {
      const result = await this._tradingCopyRepository.getListCopiesByExpert(
        {id_expert} as ITradingCopyModel,
        parseInt(page.toString()),
        parseInt(size.toString()),
        [contants.STATUS.ACTIVE, contants.STATUS.PAUSE],
      );

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getTradingCopies(id_expert: Schema.Types.ObjectId): Promise<ITradingCopyModel[]> {
    try {
      const result = await this._tradingCopyRepository.findWhere({status: contants.STATUS.ACTIVE, id_expert});
      if (result) {
        return result;
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

  public async createTradingCopy(tradingCopy: CreateTradingCopy): Promise<ITradingCopyModel> {
    try {
      const errors = await validate(tradingCopy);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const tradingCopyEntity = tradingCopy as ITradingCopyModel;
        // const duplicateResult = await this._tradingCopyRepository.findOne({
        //   id_expert: tradingCopyEntity.id_expert,
        //   id_user: tradingCopyEntity.id_user,
        // } as ITradingCopyModel);
        // if (!duplicateResult) {
        const userBlock = await this._userRepository.findOne({
          _id: tradingCopyEntity.id_user,
          status_trading_copy: contants.STATUS.BLOCK,
        });
        if (!userBlock) {
          const user = await this._userRepository.findOne({
            _id: tradingCopyEntity.id_user,
          });
          if (user) {
            if (user.total_amount >= tradingCopyEntity.base_amount) {
              const updateUser = await this._userRepository.update(tradingCopyEntity.id_user, {
                total_amount: user.total_amount - tradingCopyEntity.base_amount,
              });
              const result = await this._tradingCopyRepository.create(tradingCopyEntity);

              if (updateUser) {
                return result;
              }
              return null;
            } else {
              throw new Error('Account does not have enough money!');
            }
            return null;
          } else {
            throw new Error('Account does not have enough money!');
          }
        } else {
          throw new Error('You are blocked in 24 hours!');
        }
        // } else {
        //   throw new Error('Trading copy is exist!');
        // }
      }
    } catch (err) {
      throw err;
    }
  }

  public async stopTradingCopy(tradingCopy: StopTradingCopy): Promise<boolean> {
    try {
      const errors = await validate(tradingCopy);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const copy = await this._tradingCopyRepository.findOne({
          _id: tradingCopy.id_copy,
          id_user: tradingCopy.id_user,
        });
        if (copy) {
          if (copy.investment_amount > copy.base_amount) {
            const histories = await this._tradingHistoryRepository.findWhere({id_user: copy.id_user});
            let keep_amount = 0;
            if (histories) {
              for (const history of histories) {
                if (
                  history.closing_time.getDate() === new Date().getDate() &&
                  history.closing_time.getMonth() === new Date().getMonth() &&
                  history.closing_time.getFullYear() === new Date().getFullYear()
                ) {
                  if (history.profit === 0) {
                    keep_amount = keep_amount - history.order_amount;
                  } else {
                    keep_amount = keep_amount + history.profit - history.fee_to_expert - history.fee_to_trading;
                  }
                }
              }
            }
            const user = await this._userRepository.findOne({_id: copy.id_user});
            const resultUser = await this._userRepository.update(copy.id_user, {
              blockedAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
              status_trading_copy: contants.STATUS.BLOCK,
              total_amount: user.total_amount + copy.investment_amount - keep_amount,
            });
            const resultCopy = await this._tradingCopyRepository.update(copy._id, {
              status: contants.STATUS.STOP,
            });

            const tradingWithdrawBussiness = new TradingWithdrawBussiness();

            await tradingWithdrawBussiness.createTradingWithdraw({
              id_user: copy.id_user,
              id_expert: null,
              id_copy: copy._id,
              amount: keep_amount,
              type_of_withdraw: contants.TYPE_OF_WITHDRAW.WITHDRAW,
              status: contants.STATUS.PENDING,
              createdAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
              updatedAt: new Date(),
              paidAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
            } as ITradingWithdrawModel);

            if (resultUser && resultCopy) {
              return true;
            }
            return false;
          } else {
            const user = await this._userRepository.findOne({_id: copy.id_user});
            const resultUser = await this._userRepository.update(copy.id_user, {
              blockedAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
              status_trading_copy: contants.STATUS.BLOCK,
              total_amount: user.total_amount + copy.investment_amount,
            });
            const resultCopy = await this._tradingCopyRepository.update(copy._id, {
              status: contants.STATUS.STOP,
            });
            if (resultUser && resultCopy) {
              return true;
            }
            return false;
          }
        } else {
          throw new Error('Trading copy is not exist!');
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async pauseTradingCopy(tradingCopy: GetTradingCopy): Promise<boolean> {
    try {
      const errors = await validate(tradingCopy);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const copy = await this._tradingCopyRepository.findOne({
          _id: tradingCopy.id_copy,
        });
        if (copy) {
          if (copy.status === contants.STATUS.ACTIVE) {
            const resultCopy = await this._tradingCopyRepository.update(copy._id, {
              status: contants.STATUS.PAUSE,
            });
            if (resultCopy) {
              return true;
            }
            return false;
          } else {
            throw new Error('Trading copy is not active!');
          }
        } else {
          throw new Error('Trading copy is not exist!');
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async resumeTradingCopy(tradingCopy: GetTradingCopy): Promise<boolean> {
    try {
      const errors = await validate(tradingCopy);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const copy = await this._tradingCopyRepository.findOne({
          _id: tradingCopy.id_copy,
        });
        if (copy) {
          if (copy.status === contants.STATUS.PAUSE) {
            if (copy.investment_amount >= 500) {
              const resultCopy = await this._tradingCopyRepository.update(copy._id, {
                status: contants.STATUS.ACTIVE,
                base_amount: copy.investment_amount,
              });
              if (resultCopy) {
                return true;
              }
              return false;
            } else {
              throw new Error('Investment amount is less than 500');
            }
          } else {
            throw new Error('Trading copy is not pause!');
          }
        } else {
          throw new Error('Trading copy is not exist!');
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async getTradingCopyById(tradingCopy: GetTradingCopy): Promise<ITradingCopyModel> {
    try {
      const errors = await validate(tradingCopy);
      if (errors.length > 0) {
        throw new Error(Object.values(errors[0].constraints)[0]);
      } else {
        const copy = await this._tradingCopyRepository.findOne({
          _id: tradingCopy.id_copy,
        });
        if (copy) {
          return copy;
        } else {
          return null;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async getListTradingCopies(params: GetTradingCopyOfUser, page: number, size: number): Promise<any> {
    try {
      const copy = await this._tradingCopyRepository.getListCopies(
        {id_user: params.id_user} as ITradingCopyModel,
        parseInt(page.toString()),
        parseInt(size.toString()),
        [contants.STATUS.ACTIVE, contants.STATUS.PAUSE],
      );
      const temp = {
        result: null,
        count: 0,
      };
      temp.count = copy.count;
      temp.result = {...copy.result[0]};
      if (copy) {
        return temp;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  public async calculateMoney(
    id_copy: Schema.Types.ObjectId,
    id: Schema.Types.ObjectId,
    type: string,
    money: number,
  ): Promise<void> {
    try {
      if (type === 'user') {
        const copy = await this._tradingCopyRepository.findOne({_id: id_copy});
        await this._tradingCopyRepository.update(copy._id, {
          investment_amount: copy.investment_amount + money,
        });
      } else {
        const expert = await this._expertRepository.findOne({_id: id});
        await this._expertRepository.update(id, {total_amount: expert.total_amount + money});
      }
    } catch (err) {
      throw err;
    }
  }

  public async transferMoneyToExpert(withdraw: ITradingWithdrawModel): Promise<void> {
    try {
      const history = await this._tradingHistoryRepository.findOne({
        id_user: withdraw.id_user,
        id_expert: withdraw.id_expert,
        id_order: withdraw.id_order,
      });
      if (history) {
        await this._tradingHistoryRepository.update(history._id, {
          status: true,
        });
      }
      const expert = await this._expertRepository.findOne({
        _id: withdraw.id_expert,
      });
      if (expert) {
        await this._expertRepository.update(expert._id, {
          total_amount: expert.total_amount + withdraw.amount,
        });
        await this._tradingWithdrawRepository.update(withdraw._id, {
          status: contants.STATUS.FINISH,
          updatedAt: new Date(),
        });
      }
    } catch (err) {
      throw err;
    }
  }

  public async transferMoneyToTradingCopy(transfer: TransferMoneyTradingCopy): Promise<boolean> {
    try {
      const userCopy = await this._userRepository.findOne({
        _id: transfer.id_user,
      });
      const copy = await this._tradingCopyRepository.findOne({
        _id: transfer.id_copy,
      });

      if (userCopy && copy) {
        const resultUser = await this._userRepository.update(userCopy._id, {
          total_amount: userCopy.total_amount - transfer.amount,
        });

        const resultCopy = await this._tradingCopyRepository.update(userCopy._id, {
          investment_amount: copy.investment_amount + transfer.amount,
          base_amount: copy.investment_amount + transfer.amount,
        });

        if (resultUser && resultCopy) {
          return true;
        } else {
          return false;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  public async transferMoneyAfterStopCopy(withdraw: ITradingWithdrawModel): Promise<void> {
    try {
      const copy = await this._tradingCopyRepository.findOne({
        _id: withdraw.id_copy,
      });
      await this._tradingCopyRepository.update(copy._id, {
        investment_amount: copy.investment_amount - withdraw.amount,
      });
      const user = await this._userRepository.findOne({
        _id: withdraw.id_user,
      });
      await this._userRepository.update(user._id, {
        total_amount: user.total_amount + withdraw.amount,
      });
      await this._tradingWithdrawRepository.update(withdraw._id, {
        status: contants.STATUS.FINISH,
        updatedAt: new Date(),
      });
    } catch (err) {
      throw err;
    }
  }
}
