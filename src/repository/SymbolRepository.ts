import ISymbolModel from '@src/models/symbols/ISymbolModel';
import SymbolSchema from '@src/schemas/SymbolSchema';
import {Schema} from 'mongoose';
import {RepositoryBase} from './base';

export default class SymbolRepository extends RepositoryBase<ISymbolModel> {
  constructor() {
    super(SymbolSchema);
  }

  public async getListSymbols(bockIds: Schema.Types.ObjectId[]): Promise<any> {
    try {
      const result = await SymbolSchema.find({_id: {$in: bockIds}});
      return result;
    } catch (err) {
      throw err.errors ? err.errors.shift() : err;
    }
  }
}
