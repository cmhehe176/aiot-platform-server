import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './feature/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './feature/auth/guards/auth.guard'
import { RoleGuard } from './feature/auth/guards/role.guard'
import { ProjectModule } from './feature/project/project.module'
import { UserModule } from './feature/user/user.module'
import { DeviceModule } from './feature/device/device.module'
import { RabbitMqModule } from './feature/rabbit-mq/rabbit-mq.module'
import { EmailModule } from './feature/email/email.module'
import { SupportModule } from './feature/support/support.module'
import { MessageModule } from './feature/message/message.module'
import { StorageModule } from './feature/storage/storage.module'
import { DashboardModule } from './feature/dashboard/dashboard.module'
import { SocketModule } from './feature/socket/socket.module'
import { NotificationModule } from './feature/notification/notification.module'
import { SensorModule } from './feature/sensor/sensor.module'
import { ObjectModule } from './feature/object/object.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ProjectModule,
    UserModule,
    DeviceModule,
    SocketModule,
    RabbitMqModule,
    EmailModule,
    SupportModule,
    MessageModule,
    StorageModule,
    DashboardModule,
    DeviceModule,
    NotificationModule,
    SensorModule,
    ObjectModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
