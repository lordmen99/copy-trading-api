import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';

export class AddUser {
  @IsNotEmpty({message: 'Full name is required'})
  @IsString({
    message: 'Full name is string',
  })
  fullname: string;

  @IsNotEmpty({message: 'Username is required'})
  @IsString({
    message: 'Username is string',
  })
  username: string;

  @IsNotEmpty({message: 'Password is required'})
  @MinLength(8, {
    message: 'Password must be at least 8 characters!',
  })
  password: string;

  @IsEmail({}, {message: 'Email invalidate'})
  @MaxLength(200, {
    message: 'Email is too long',
  })
  email: string;

  phone?: string;

  avatar?: string;

  @IsNotEmpty({message: 'Total amount is required'})
  total_amount: number;

  @IsNotEmpty({message: 'Status is required'})
  is_virtual: boolean;

  status?: string;

  status_trading_copy?: string;
}

export class EditUser {
  _id?: string;
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

  @IsNotEmpty({message: 'Total amount is required'})
  total_amount?: number;

  @IsNotEmpty({message: 'Status is required'})
  is_virtual?: boolean;
}

export class GetUser {
  @IsNotEmpty({message: 'Id is required'})
  @IsString({
    message: 'Id is string',
  })
  _id?: string;
}
