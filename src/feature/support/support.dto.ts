import { IsIn, IsString } from 'class-validator';

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

  @IsString()
  @IsIn(['message', 'email'] as const)
  method: TypeMessage;
}

export type TypeMessage = 'message' | 'email';
