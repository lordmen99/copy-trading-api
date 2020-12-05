import IExpertModel from '@src/models/cpExpert/IExpertModel';
import CPExpertSchema from '@src/schemas/CPExpertSchema';
import {contants} from '@src/utils';
import {RepositoryBase} from './base';

export default class ExpertRepository extends RepositoryBase<IExpertModel> {
  constructor() {
    super(CPExpertSchema);
  }

  public async executeListExpertPage(page: number, size: number): Promise<any> {
    try {
      const result = await this.findWithPagingWithAggregate(parseFloat(page.toString()), parseFloat(size.toString()));

      const list = [];
      if (result) {
        const info = {
          gain_rate_last_month: 0,
          gain_rate_months: 0,
          copier: 0,
          removed_copier: 0,
        };
        for (const expert of result.result[0].data) {
          if (expert.trading_copies) {
            let copier = 0;
            const listCheckUsers = [];
            for (const user of expert.trading_copies) {
              if (user.status === contants.STATUS.ACTIVE && listCheckUsers.indexOf(user.id_user.toString()) === -1) {
                copier = copier + 1;
                listCheckUsers.push(user.id_user.toString());
              }
            }
            info.copier = copier;
          }
          if (expert.trading_copies) {
            const today = new Date();
            let removed_copier = 0;
            const listCheckUsers = [];
            for (const user of expert.trading_copies) {
              if (
                today.getMonth() === new Date(user.createdAt).getMonth() &&
                user.status === contants.STATUS.STOP &&
                listCheckUsers.indexOf(user.id_user.toString()) === -1
              )
                removed_copier = removed_copier + 1;
              listCheckUsers.push(user.id_user.toString());
            }
            info.removed_copier = removed_copier;
          }

          if (expert.trading_histories) {
            let gain = 0;
            for (const history of expert.trading_histories) {
              if (
                new Date().getMonth() - 1 === new Date(history.closing_time).getMonth() &&
                new Date().getFullYear() === new Date(history.closing_time).getFullYear()
              ) {
                if (history.profit > 0) {
                  gain = gain + history.profit - history.fee_to_trading;
                } else {
                  gain = gain - history.order_amount;
                }
              }
            }
            const gain_rate_last_month = gain / expert.total_amount;
            info.gain_rate_last_month = gain_rate_last_month;
          }

          if (expert.trading_histories) {
            let gain = 0;
            for (const history of expert.trading_histories) {
              if (new Date().getFullYear() === new Date(history.closing_time).getFullYear()) {
                if (history.profit > 0) {
                  gain = gain + history.profit - history.fee_to_trading;
                } else {
                  gain = gain - history.order_amount;
                }
              }
            }
            const gain_rate_months = gain / expert.total_amount;
            info.gain_rate_months = gain_rate_months;
          }
          const temp = {
            expert,
            info: {...info},
          };
          list.push({...temp});
        }
      }

      const res = {
        result: list,
        count: result.count,
      };
      return res;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
