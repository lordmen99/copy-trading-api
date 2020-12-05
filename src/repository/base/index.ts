import mongoose, {Schema} from 'mongoose';
import IRead from '../interfaces/IRead';
import IWrite from '../interfaces/IWrite';

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
  private _model: mongoose.Model<mongoose.Document>;
  private _aggregate: mongoose.Aggregate<any>;
  private _query: mongoose.Query<any>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  public async findById(id: string): Promise<T> {
    try {
      const result = await this._model.findById(id);
      return result as T;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findAll(): Promise<T[]> {
    try {
      const result = await this._model.find({});
      return result as T[];
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findWithPaging(page: number, size: number): Promise<any> {
    try {
      const result = await this._model
        .find({})
        .limit(size)
        .skip((page - 1) * size);
      const count = await this._model.countDocuments({});
      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findWithPagingById(item: T, page: number, size: number): Promise<any> {
    try {
      const result = await this._model
        .find(item)
        .limit(size)
        .skip((page - 1) * size);
      const count = await this._model.countDocuments(item);
      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
  public async findWithPagingByUserWithAggregate(
    item: any,
    page: number,
    size: number,
    localField: string,
    foreignField: string,
    as: string,
    from: string,
  ): Promise<any> {
    try {
      const result = await this._model.aggregate([
        {
          $match: {
            id_user: this.toObjectId(item.id_user),
          },
        },
        {
          $lookup: {
            from,
            localField,
            foreignField,
            as,
          },
        },
        {
          $limit: size,
        },
        {
          $skip: (page - 1) * size,
        },
      ]);

      const count = await this._model.countDocuments(item);

      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findWithPagingByExpertWithAggregate(
    item: any,
    // page: number,
    // size: number,
    localField: string,
    foreignField: string,
    as: string,
    from: string,
  ): Promise<any> {
    try {
      const result = await this._model.aggregate([
        {
          $lookup: {
            from,
            localField,
            foreignField,
            as,
          },
        },
        {
          $match: {
            id_expert: this.toObjectId(item.id_expert),
          },
        },
        // {
        //   $limit: size,
        // },
        // {
        //   $skip: (page - 1) * size,
        // },
      ]);

      const count = await this._model.countDocuments(item);

      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findWithPagingUserCopyWithAggregate(
    item: any,
    // page: number,
    // size: number,
    localField: string,
    foreignField: string,
    as: string,
    from: string,
  ): Promise<any> {
    try {
      const result = await this._model.aggregate([
        {
          $facet: {
            total: [{$group: {_id: null, count: {$sum: 1}}}],
            data: [
              {$skip: 0},
              {$limit: 10},
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
            ],
          },
        },
        {$unwind: '$total'},
        {$project: {count: '$total.count', data: '$data'}},
      ]);

      const count = await this._model.countDocuments(item);

      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findWithPagingWithAggregate(page: number, size: number): Promise<any> {
    try {
      const result = await this._model.aggregate([
        {
          $facet: {
            total: [{$group: {_id: null, count: {$sum: 1}}}],
            data: [
              {$skip: (page - 1) * size},
              {$limit: size},
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
            ],
          },
        },
        {$unwind: '$total'},
        {$project: {count: '$total.count', data: '$data'}},
      ]);

      const count = await this._model.countDocuments({});

      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findWithPagingByIdWithOr(item: any, page: number, size: number, orArray): Promise<any> {
    try {
      const result = await this._model
        .aggregate([
          {
            $lookup: {
              from: 'cp_experts',
              localField: 'id_expert',
              foreignField: '_id',
              as: 'expert',
            },
          },
          {
            $match: {
              status: {$in: orArray},
              id_user: this.toObjectId(item.id_user),
            },
          },
        ])
        .limit(size)
        .skip((page - 1) * size);

      const count = await this._model.countDocuments(item).or([{status: {$in: orArray}}]);
      return {
        result,
        count,
      };
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findWhere(item: T): Promise<T[]> {
    try {
      const result = await this._model.find(item);
      return result as T[];
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findWhereSortByField(item: T, field: string): Promise<T[]> {
    try {
      const result = await this._model.find(item).sort({
        [field]: 1,
      });
      return result as T[];
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findOne(item: T): Promise<T> {
    try {
      const result = await this._model.findOne(item);
      return result as T;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async findOneWithSelect(item: T, select: string): Promise<T> {
    try {
      const result = await this._model.findOne(item).select(select);
      return result as T;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async create(item: T): Promise<T> {
    try {
      const result = await this._model.create(item);
      return result as T;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async update(id: Schema.Types.ObjectId, item: T): Promise<T> {
    try {
      const result = await this._model.updateOne({_id: id}, item);
      return result as T;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async delete(id: Schema.Types.ObjectId): Promise<boolean> {
    try {
      await this._model.deleteOne({_id: id});
      return true;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public toObjectId(id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(id);
  }
}
