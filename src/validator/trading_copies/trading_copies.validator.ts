import {IsNotEmpty, IsString} from 'class-validator';

export class CreateTradingCopy {
  @IsNotEmpty({message: 'Id user is required'})
  @IsString({
    message: 'Id user is string',
  })
  id_user: string;

  @IsNotEmpty({message: 'Id expert is required'})
  @IsString({
    message: 'Id expert is string',
  })
  id_expert: string;

  @IsNotEmpty({message: 'Investment amount is required'})
  investment_amount: number;

  @IsNotEmpty({message: 'Investment amount is required'})
  maximum_rate: number;

  @IsNotEmpty({message: 'Investment amount is required'})
  stop_loss: number;

  @IsNotEmpty({message: 'Investment amount is required'})
  taken_profit: number;

  status: string;
}
