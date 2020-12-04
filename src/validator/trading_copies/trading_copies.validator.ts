import {IsNotEmpty, IsString, Min} from 'class-validator';

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

  @IsNotEmpty({message: 'Investment amount is required and higher than 500'})
  @Min(500)
  investment_amount: number;

  base_amount: number;

  @IsNotEmpty({message: 'Maximum rate is required'})
  maximum_rate: number;

  @IsNotEmpty({message: 'Has maximum rate is required'})
  has_maximum_rate: boolean;

  @IsNotEmpty({message: 'Stop loss is required'})
  stop_loss: number;

  @IsNotEmpty({message: 'Has stop loss is required'})
  has_stop_loss: boolean;

  @IsNotEmpty({message: 'Taken profit is required'})
  taken_profit: number;

  @IsNotEmpty({message: 'Has taken profit is required'})
  has_taken_profit: boolean;

  status?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export class StopTradingCopy {
  @IsNotEmpty({message: 'Id user is required'})
  @IsString({
    message: 'Id user is string',
  })
  id_user: string;

  @IsNotEmpty({message: 'Id copy is required'})
  @IsString({
    message: 'Id copy is string',
  })
  id_copy: string;
}

export class GetTradingCopy {
  @IsNotEmpty({message: 'Id copy is required'})
  @IsString({
    message: 'Id copy is string',
  })
  id_copy: string;
}

export class GetTradingCopyOfUser {
  @IsNotEmpty({message: 'Id user is required'})
  @IsString({
    message: 'Id user is string',
  })
  id_user: string;
}

export class TransferMoneyTradingCopy {
  @IsNotEmpty({message: 'Id user is required'})
  @IsString({
    message: 'Id user is string',
  })
  id_user: string;

  @IsNotEmpty({message: 'Id copy is required'})
  @IsString({
    message: 'Id copy is string',
  })
  id_copy: string;

  @IsNotEmpty({message: 'Amount is required'})
  amount: number;
}
