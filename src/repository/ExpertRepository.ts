import IExpertModel from '@src/models/cpExpert/IExpertModel';
import CPExpertSchema from '@src/schemas/CPExpertSchema';
import {contants} from '@src/utils';
import mongoose from 'mongoose';
import {RepositoryBase} from './base';

export default class ExpertRepository extends RepositoryBase<IExpertModel> {
  constructor() {
    super(CPExpertSchema);
  }

  public async getExpertDetails(item: IExpertModel) {
    try {
      const result = await CPExpertSchema.aggregate([
        {
          $lookup: {
            from: 'cp_trading_gain_every_months',
            localField: '_id',
            foreignField: 'id_expert',
            as: 'gain_every_months',
          },
        },
        {
          $lookup: {
            from: 'cp_trading_gains',
            let: {
              id_expert: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {$eq: ['$id_expert', '$$id_expert']},
                  createdAt: {
                    $gte: new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0)),
                    $lt: new Date(),
                  },
                },
              },
            ],
            as: 'trading_gains',
          },
        },
        {
          $lookup: {
            from: 'cp_trading_copies',
            let: {
              id_expert: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {$eq: ['$id_expert', '$$id_expert']},
                  status: {$ne: contants.STATUS.STOP},
                },
              },
              {
                $group: {
                  _id: null,
                  copier: {$sum: 1},
                },
              },
            ],
            as: 'copier',
          },
        },
        {
          $project: {
            _id: 1,
            fullname: 1,
            username: 1,
            avatar: 1,
            gain_every_months: 1,
            trading_gains: 1,
            copier: 1,
          },
        },
        {
          $match: {
            _id: this.toObjectId(item._id),
          },
        },
      ]);
      if (result.length > 0) {
        const info = {
          gain_rate_last_month: 0,
          gain_rate_months: 0,
          copier: 0,
          removed_copier: 0,
        };
        const temp = {
          result: result[0],
          info,
        };
        if (result[0].gain_every_months.length > 0) {
          info.removed_copier = result[0].gain_every_months[0].removed_copier;
          info.gain_rate_last_month = result[0].gain_every_months[0].total_gain;
          // let gain = 0;
          // for (const item of result[0].gain_every_months) {
          //   gain = gain + item.total_gain;
          // }
          // info.gain_rate_months = parseInt((gain / result[0].gain_every_months.length).toString());
        }
        if (result[0].copier.length > 0) {
          info.copier = result[0].copier[0].copier;
        }
        let gain = 0;

        if (result[0].trading_gains.length > 0) {
          for (const item of result[0].trading_gains) {
            gain = gain + item.total_gain;
          }
          info.gain_rate_months = parseInt((gain / result[0].trading_gains.length).toString());
        }
        temp.result = result[0];
        temp.info = info;
        return temp;
      }
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async getUserCopyByExpert(item: any, page: number, size: number): Promise<any> {
    try {
      const result = await CPExpertSchema.aggregate([
        {
          $match: {
            id_expert: new mongoose.Types.ObjectId(item.id_expert),
          },
        },
        {
          $facet: {
            data: [
              {$skip: (parseInt(page.toString()) - 1) * parseInt(size.toString())},
              {$limit: parseInt(size.toString())},
              {
                $lookup: {
                  from: 'cp_trading_copies',
                  localField: '_id',
                  foreignField: 'id_expert',
                  as: 'trading_copies',
                },
              },
              {
                $lookup: {
                  from: 'cp_users',
                  localField: 'trading_copies.id_user',
                  foreignField: '_id',
                  as: 'users',
                },
              },
              // {
              //   $project: {
              //     _id: 1,
              //     status: 1,
              //     id_user: 1,
              //     id_expert: 1,
              //     investment_amount: 1,
              //     maximum_rate: 1,
              //     has_maximum_rate: 1,
              //     has_stop_loss: 1,
              //     has_taken_profit: 1,
              //     stop_loss: 1,
              //     taken_profit: 1,
              //     createdAt: 1,
              //     updatedAt: 1,
              //     base_amount: 1,
              //     trading_copies: {
              //       user: 1,
              //     },
              //   },
              // },
            ],
          },
        },
        {$project: {data: '$data'}},
      ]);

      const count = await CPExpertSchema.countDocuments(item);

      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async executeListExpertPage(username: string, page: number, size: number): Promise<any> {
    try {
      const result = await CPExpertSchema.aggregate([
        {
          $match: {
            username: {$regex: '.*' + username + '.*'},
          },
        },
        {
          $facet: {
            total: [{$group: {_id: null, count: {$sum: 1}}}],
            data: [
              {$skip: (parseInt(page.toString()) - 1) * parseInt(size.toString())},
              {$limit: parseInt(size.toString())},
              {
                $lookup: {
                  from: 'cp_trading_histories',
                  localField: '_id',
                  foreignField: 'id_expert',
                  as: 'trading_histories',
                },
              },
              {
                $lookup: {
                  from: 'cp_trading_copies',
                  localField: '_id',
                  foreignField: 'id_expert',
                  as: 'trading_copies',
                },
              },
              {
                $lookup: {
                  from: 'cp_trading_gains',
                  localField: '_id',
                  foreignField: 'id_expert',
                  as: 'trading_gains',
                },
              },
              // {
              //   $project: {
              //     _id: 1,
              //     fullname: 1,
              //     username: 1,
              //     avatar: 1,
              //     trading_copies: 1,
              //     trading_histories: 1,
              //     trading_gains: 1,
              //   },
              // },
            ],
          },
        },
        {$unwind: '$total'},
        {$project: {count: '$total.count', data: '$data'}},
      ]);

      const count = await CPExpertSchema.countDocuments({});

      const list = [];
      if (result) {
        const info = {
          gain_rate_last_month: 0,
          gain_rate_months: 0,
          copier: 0,
          removed_copier: 0,
        };
        for (const expert of result[0].data) {
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
          if (expert.trading_gains.length > 0) {
            info.gain_rate_last_month = expert.trading_gains[0].gain_last_month;
            info.gain_rate_months = expert.trading_gains[0].gain_last_year;
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
        count,
      };
      return res;
    } catch (err) {
      return [];
    }
  }

  public async executeListExpertPageForUser(page: number, size: number): Promise<any> {
    try {
      const result = await CPExpertSchema.aggregate([
        {
          $facet: {
            total: [{$group: {_id: null, count: {$sum: 1}}}],
            data: [
              {$skip: (parseInt(page.toString()) - 1) * parseInt(size.toString())},
              {$limit: parseInt(size.toString())},
              {
                $lookup: {
                  from: 'cp_trading_gain_every_months',
                  localField: '_id',
                  foreignField: 'id_expert',
                  as: 'gain_every_months',
                },
              },
              {
                $lookup: {
                  from: 'cp_trading_gains',
                  let: {
                    id_expert: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {$eq: ['$id_expert', '$$id_expert']},
                        createdAt: {
                          $gte: new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0)),
                          $lt: new Date(),
                        },
                      },
                    },
                  ],
                  as: 'trading_gains',
                },
              },
              {
                $lookup: {
                  from: 'cp_trading_gains',
                  let: {
                    id_expert: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {$eq: ['$id_expert', '$$id_expert']},
                        createdAt: {
                          $gte: new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0)),
                          $lt: new Date(),
                        },
                      },
                    },
                    {
                      $group: {
                        _id: null,
                        total_gain: {$sum: '$total_gain'},
                      },
                    },
                  ],
                  as: 'total_gain',
                },
              },
              {
                $lookup: {
                  from: 'cp_trading_copies',
                  let: {
                    id_expert: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {$eq: ['$id_expert', '$$id_expert']},
                        status: {$ne: contants.STATUS.STOP},
                      },
                    },
                    {
                      $group: {
                        _id: null,
                        copier: {$sum: 1},
                      },
                    },
                  ],
                  as: 'copier',
                },
              },
              {
                $sort: {total_gain: 1},
              },
              {
                $project: {
                  _id: 1,
                  fullname: 1,
                  username: 1,
                  avatar: 1,
                  gain_every_months: 1,
                  trading_histories: 1,
                  trading_gains: 1,
                  total_gain: 1,
                  copier: 1,
                },
              },
            ],
          },
        },
        {$unwind: '$total'},
        {$project: {count: '$total.count', data: '$data'}},
      ]);

      const count = await CPExpertSchema.countDocuments({});

      const list = [];
      if (result) {
        for (const expert of result[0].data) {
          const info = {
            gain_rate_last_month: 0,
            gain_rate_months: 0,
            copier: 0,
            removed_copier: 0,
          };
          if (expert.gain_every_months.length > 0) {
            info.removed_copier = expert.gain_every_months[0].removed_copier;
            info.gain_rate_last_month = expert.gain_every_months[0].total_gain;
          }
          let gain = 0;
          if (expert.copier.length > 0) {
            info.copier = expert.copier[0].copier;
          }
          if (expert.trading_gains.length > 0) {
            for (const item of expert.trading_gains) {
              gain = gain + item.total_gain;
            }
            info.gain_rate_months = parseInt((gain / expert.trading_gains.length).toString());
          }
          const temp = {
            expert,
            info: {...info},
          };
          list.push({...temp});
        }
      }

      // for (let i = 0; i < list.length - 1; i++) {
      //   for (let j = list.length - 1; j > i; j--) {
      //     if (list[j].info.gain_rate_months > list[j - 1].info.gain_rate_months) {
      //       let t = list[j];
      //       list[j] = list[j - 1];
      //       list[j - 1] = t;
      //     }
      //   }
      // }

      const res = {
        result: list,
        count,
      };
      return res;
    } catch (err) {
      return [];
    }
  }

  public async searchByUserName(data, page: number, size: number): Promise<any> {
    try {
      const result = await CPExpertSchema.aggregate([
        {
          $match: {
            username: {$regex: '.*' + data.username + '.*'},
          },
        },
        {
          $facet: {
            total: [{$group: {_id: null, count: {$sum: 1}}}],
            data: [
              {$skip: (parseInt(page.toString()) - 1) * parseInt(size.toString())},
              {$limit: parseInt(size.toString())},
              {
                $lookup: {
                  from: 'cp_trading_gain_every_months',
                  localField: '_id',
                  foreignField: 'id_expert',
                  as: 'gain_every_months',
                },
              },
              {
                $project: {
                  _id: 1,
                  fullname: 1,
                  username: 1,
                  avatar: 1,
                  gain_every_months: 1,
                },
              },
            ],
          },
        },
        {$unwind: '$total'},
        {$project: {count: '$total.count', data: '$data'}},
      ]);

      const count = await CPExpertSchema.countDocuments({
        username: {$regex: '.*' + data.username + '.*'},
      });

      const list = [];
      if (result) {
        const info = {
          gain_rate_last_month: 0,
          gain_rate_months: 0,
          copier: 0,
          removed_copier: 0,
        };
        for (const expert of result[0].data) {
          if (expert.gain_every_months.length > 0) {
            info.copier = expert.gain_every_months[0].copier;
            info.removed_copier = expert.gain_every_months[0].removed_copier;
            info.gain_rate_last_month = expert.gain_every_months[0].total_gain;
            let gain = 0;
            for (const item of expert.gain_every_months) {
              gain = gain + item.total_gain;
            }
            info.gain_rate_months = parseInt((gain / expert.gain_every_months.length).toString());
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
        count,
      };
      return res;
    } catch (err) {
      return [];
    }
  }

  public async insertManyExpert(arrExpert: IExpertModel[]) {
    try {
      const result = await CPExpertSchema.insertMany(arrExpert);
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
