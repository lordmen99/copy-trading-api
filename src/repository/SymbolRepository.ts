import ISymbolModel from '@src/models/symbols/ISymbolModel';
import SymbolSchema from '@src/schemas/SymbolSchema';
import {RepositoryBase} from './base';

export default class SymbolRepository extends RepositoryBase<ISymbolModel> {
  constructor() {
    super(SymbolSchema);
  }
}
