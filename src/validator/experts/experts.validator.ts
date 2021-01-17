import {IsEmail, IsNotEmpty, IsString, MaxLength} from 'class-validator';
import {Schema} from 'mongoose';

export class AddExpert {
  @IsNotEmpty({message: 'Full name is required'})
  @IsString({
    message: 'Full name is string',
  })
  fullname?: string;

  @IsNotEmpty({message: 'Username is required'})
  @IsString({
    message: 'Username is string',
  })
  username?: string;

  // @IsNotEmpty({message: 'Password is required'})
  // @MinLength(8, {
  //   message: 'Password must be at least 8 characters!',
  // })
  password?: string;

  @IsEmail({}, {message: 'Email invalidate'})
  @MaxLength(200, {
    message: 'Email is too long',
  })
  email?: string;

  phone?: string;

  avatar?: string;

  @IsNotEmpty({message: 'Total amount is required'})
  total_amount?: number;

  base_amount?: number;

  @IsNotEmpty({message: 'Status is required'})
  is_virtual?: boolean;

  status?: string;

  auto_gen_copier?: boolean;
}

export class EditExpert {
  _id?: Schema.Types.ObjectId;
  @IsNotEmpty({message: 'Full name is required'})
  @IsString({
    message: 'Full name is string',
  })
  fullname?: string;

  @IsNotEmpty({message: 'Username is required'})
  @IsString({
    message: 'Username is string',
  })
  username?: string;

  @IsEmail({}, {message: 'Email invalidate'})
  @MaxLength(200, {
    message: 'Email is too long',
  })
  email?: string;

  phone?: string;

  avatar?: string;

  // @IsNotEmpty({message: 'Total amount is required'})
  total_amount?: number;

  @IsNotEmpty({message: 'Status is required'})
  is_virtual?: boolean;
}

export class GetExpert {
  @IsNotEmpty({message: 'Id is required'})
  _id?: string;
}

export class GetExpertByName {
  // @IsNotEmpty({message: 'Name is required'})
  username: string;
}

export class UpdateVirtualCopier {
  id_expert: Schema.Types.ObjectId;

  @IsNotEmpty({message: 'Number of copier is required'})
  number: number;
}