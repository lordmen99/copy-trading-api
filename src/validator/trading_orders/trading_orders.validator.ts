import {IsNotEmpty, IsString} from 'class-validator';

export class CreateTradingOrder {
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

  status: string;

  createdAt?: Date;

  orderedAt?: Date;

  timeSetup?: Date;
}
