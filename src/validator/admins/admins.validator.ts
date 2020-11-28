import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';

export class AddAdmin {
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

  status: string;
}

export class EditAdmin {
  _id?: string;
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

  status: string;
}

export class ChangePasswordAdmin {
  _id: string;
  current_password: string;

  @IsNotEmpty({message: 'Password is required'})
  @MinLength(8, {
    message: 'Password must be at least 8 characters!',
  })
  new_password: string;
}
