import { IsString } from 'class-validator';

export class CreateSupportDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class GetListDto {
  q?: string;
}

export class ReplyDto {
  @IsString()
  reply: string;

  type?: 'message' | 'email';
}
