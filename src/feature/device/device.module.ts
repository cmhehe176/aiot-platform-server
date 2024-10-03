import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity, PermissionProjectEntity } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity, PermissionProjectEntity])],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
