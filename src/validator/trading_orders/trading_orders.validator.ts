import {IsNotEmpty, IsString} from 'class-validator';

export class CreateTradingOrder {
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

  @IsNotEmpty({message: 'Id admin is required'})
  @IsString({
    message: 'Id admin is string',
  })
  id_admin: string;

  @IsNotEmpty({message: 'Type of order is required'})
  @IsString({
    message: 'Type of order is string',
  })
  type_of_order: string;

  @IsNotEmpty({message: 'Threshold percent is required'})
  threshold_percent: number;

  @IsNotEmpty({message: 'Threshold amount is required'})
  threshold_amount: number;

  @IsNotEmpty({message: 'Type is required'})
  @IsString({
    message: 'Type is string',
  })
  type: string;

  @IsNotEmpty({message: 'Total amount is required'})
  total_amount: number;

  status: string;

  createdAt?: Date;

  updatedAt?: Date;
}
