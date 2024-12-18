import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import { DeviceService } from './device.service'
import { ERole, Roles } from 'src/common/decorators/role.decorator'
import { IUser, User } from 'src/common/decorators/user.decorator'

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Put(':id')
  @Roles(ERole.ADMIN)
  UpdateDevice(@Param('id') id: number, @Body() data: any) {
    return this.deviceService.UpdateDevice(data, id)
  }

  @Get()
  getList(@Query() query: { projectId: number }, @User() user: IUser) {
    return this.deviceService.getListDevice(user, query.projectId)
  }

  @Get('free')
  getListFree() {
    return this.deviceService.getListDeviceFree()
  }

  @Get('sub-device')
  getSubDevice() {
    return this.deviceService.getSubDevice()
  }
}
