import {IsNotEmpty} from 'class-validator';
import {Schema} from 'mongoose';

export class AvailableWalletUser {
  @IsNotEmpty({message: 'Id is required'})
  id_user?: Schema.Types.ObjectId;

  @IsNotEmpty({message: 'Source is required'})
  source?: string;
}
