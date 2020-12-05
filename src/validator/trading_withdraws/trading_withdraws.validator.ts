import {IsNotEmpty} from 'class-validator';
import {Schema} from 'mongoose';

export class CreateTradingWithdraw {
  id_user: Schema.Types.ObjectId;

  id_expert: Schema.Types.ObjectId;

  id_copy: Schema.Types.ObjectId;

  @IsNotEmpty({message: 'Amount is required'})
  amount: number;

  @IsNotEmpty({message: 'Type of withdraw is required'})
  type_of_withdraw: string;

  @IsNotEmpty({message: 'Status is required'})
  status: string;

  createdAt: Date;
}
