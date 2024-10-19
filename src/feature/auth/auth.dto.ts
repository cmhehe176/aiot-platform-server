import { IsEmail, IsString } from 'class-validator';

export class Login {
  username: string;
  password: string;
  roleId?: string;
}

export class Register {
  name: string;
  telephone: string;
  email: string;
  password: string;
  roleId?: number;
}

export class ForgotPassword {
  @IsEmail()
  @IsString()
  email: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  telephone?: string;
  password?: string;
  thumbnailUrl?: string;
}
