import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SupportService } from './support.service';
import { IUser, User } from 'src/common/decorators/user.decorator';
import { CreateSupportDto, ReplyDto } from './support.dto';
import { ERole, Roles } from 'src/common/decorators/role.decorator';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}
  @Post()
  create(@Body() payload: CreateSupportDto, @User() user: IUser) {
    return this.supportService.create(payload, user);
  }

  @Get()
  getList(@Query() payload: { q: string }) {
    return this.supportService.getList(payload.q);
  }

  @Put(':id')
  @Roles(ERole.ADMIN)
  reply(
    @Param('id') id: number,
    @Body() payload: ReplyDto,
    @User() user: IUser,
  ) {
    return this.supportService.reply(id, payload, user);
  }
}
