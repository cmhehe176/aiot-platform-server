import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import { DeviceService } from './device.service'
import { ERole, Roles } from 'src/common/decorators/role.decorator'
import { IUser, User } from 'src/common/decorators/user.decorator'
import { SubDevice } from 'src/database/entities'

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

  @Get('sub-device/:type')
  getSubDevice(@Param('type') type, @User() user: IUser) {
    return this.deviceService.getSubDevice(type, user)
  }

  @Put('sub-device/:id')
  @Roles(ERole.ADMIN)
  UpdateSubDevice(@Param('id') id: number, @Body() payload: SubDevice) {
    return this.deviceService.updateSubDevice(id, payload)
  }
}
