import { Module } from '@nestjs/common'
import { DeviceService } from './device.service'
import { DeviceController } from './device.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceEntity, PermissionProjectEntity } from 'src/database/entities'
import { SocketModule } from '../socket/socket.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity, PermissionProjectEntity]),
    SocketModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
