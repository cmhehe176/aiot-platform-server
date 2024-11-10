import { Module } from '@nestjs/common'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionProjectEntity, ProjectEntity } from 'src/database/entities'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, PermissionProjectEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
