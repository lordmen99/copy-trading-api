import mongoose from 'mongoose';
import IRead from '../interfaces/IRead';
import IWrite from '../interfaces/IWrite';

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
  private _model: mongoose.Model<mongoose.Document>;

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

  public async findWithPaging(page: number, size: number): Promise<T[]> {
    try {
      const result = await this._model
        .find({})
        .limit(size)
        .skip((page - 1) * size);
      return result as T[];
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
      const count = await this._model.count(item);
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

  public async create(item: T): Promise<T> {
    try {
      const result = await this._model.create(item);
      return result as T;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async update(id: mongoose.Types.ObjectId, item: T): Promise<T> {
    try {
      const result = await this._model.update({_id: id}, item);
      return result as T;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public async delete(id: mongoose.Types.ObjectId): Promise<boolean> {
    try {
      await this._model.remove({_id: id});
      return true;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }

  public toObjectId(id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(id);
  }
}
