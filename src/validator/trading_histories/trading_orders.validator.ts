import {IsNotEmpty, IsString} from 'class-validator';

export class CreateTradingHistory {
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

  @IsNotEmpty({message: 'Opening time is required'})
  opening_time: Date;

  @IsNotEmpty({message: 'Opening price is required'})
  opening_price: number;

  @IsNotEmpty({message: 'Closing time is required'})
  closing_time: Date;

  @IsNotEmpty({message: 'Opening time is required'})
  closing_price: number;

  @IsNotEmpty({message: 'Investment amount is required'})
  investment_amount: number;

  @IsNotEmpty({message: 'Profit is required'})
  profit: number;

  @IsNotEmpty({message: 'Fee to expert is required'})
  fee_to_expert: number;

  @IsNotEmpty({message: 'Fee to trading is required'})
  fee_to_trading: number;

  @IsNotEmpty({message: 'Type of money is required'})
  @IsString({
    message: 'Type of money is string',
  })
  type_of_money: string;

  @IsNotEmpty({message: 'Type of order is required'})
  @IsString({
    message: 'Type of order is string',
  })
  type_of_order: string;

  status: boolean;
}
