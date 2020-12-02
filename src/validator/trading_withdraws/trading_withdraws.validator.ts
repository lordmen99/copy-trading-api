import {IsNotEmpty} from 'class-validator';

export class CreateTradingWithdraw {
  id_user: string;

  id_expert: string;

  id_copy: string;

  @IsNotEmpty({message: 'Amount is required'})
  amount: number;

  @IsNotEmpty({message: 'Type of withdraw is required'})
  type_of_withdraw: string;

  @IsNotEmpty({message: 'Status is required'})
  status: string;

  createdAt: Date;
}
