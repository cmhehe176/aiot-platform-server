import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { createProjectDto } from './project.dto';
import { IUser, User } from 'src/common/decorators/user.decorator';
import { ERole, Roles } from 'src/common/decorators/role.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Roles(ERole.ADMIN)
  list() {
    return this.projectService.list();
  }

  @Post()
  Create(@Body() body: createProjectDto, @User() user: IUser) {
    return this.projectService.create(user.id, body);
  }
}
