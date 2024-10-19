import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { ERole, Roles } from 'src/common/decorators/role.decorator';
import { IUser, User } from 'src/common/decorators/user.decorator';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
  @Post()
  @Roles(ERole.ADMIN)
  CreateDevice(@Body() data: any, @User() user: IUser) {
    return this.deviceService.CreateDevice(data, user.id);
  }

  @Put(':id')
  UpdateDevice(@Param('id') id: number, @Body() data: any) {
    return this.deviceService.UpdateDevice(data, id);
  }

  @Get(':id')
  getList(@Param('id', ParseIntPipe) ProjectId: number, @User() user: IUser) {
    return this.deviceService.getListDevice(user, ProjectId);
  }
}
