import {IsNotEmpty, IsString} from 'class-validator';
import {Schema} from 'mongoose';
export class CreateTradingOrder {
  @IsNotEmpty({message: 'Id expert is required'})
  id_expert: Schema.Types.ObjectId;

  @IsNotEmpty({message: 'Id admin is required'})
  id_admin: Schema.Types.ObjectId;

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

  timeZone?: string;

  endDate?: Date;
}

export class EditTradingOrder {
  @IsNotEmpty({message: 'Id order is required'})
  id_order: Schema.Types.ObjectId;

  @IsNotEmpty({message: 'Id expert is required'})
  id_expert: Schema.Types.ObjectId;

  @IsNotEmpty({message: 'Id admin is required'})
  id_admin: Schema.Types.ObjectId;

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

export class DeleteTradingOrder {
  @IsNotEmpty({message: 'Id order is required'})
  id_order: Schema.Types.ObjectId;

  status?: string;
}
