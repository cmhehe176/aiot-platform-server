import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { createProjectDto, updateProjectDto } from './project.dto';
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

  @Put()
  Update(@Body() body: updateProjectDto) {
    return this.projectService.updateProject(body);
  }

  @Delete()
  deleteUserOutProject(
    @Query('userId') userId: number,
    @Query('projectId') projectId: number,
    @User() user: IUser,
  ) {
    return this.projectService.deleteUserOutProject(userId, user.id, projectId);
  }
}
