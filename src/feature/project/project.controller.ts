import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { createProjectDto } from './project.dto';
import { IUser, User } from 'src/common/decorators/user.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  listProjectByUser(@User() user: IUser) {
    return this.projectService.listProjectByUser(user.id);
  }

  @Get(':id')
  listUserOfProject(@Param('id') id: number) {
    return this.projectService.listUserOfProject(id);
  }

  @Post()
  Create(@Body() body: createProjectDto, @User() user: IUser) {
    return this.projectService.create(user.id, body);
  }
}
