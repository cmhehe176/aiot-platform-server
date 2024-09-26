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
import { ERole, Roles } from 'src/common/decorators/role.decorator';

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
  @Roles(ERole.ADMIN)
  Create(@Body() body: createProjectDto, @User() user: IUser) {
    return this.projectService.create(user.id, body);
  }

  @Put(':id')
  @Roles(ERole.ADMIN)
  Update(
    @Param('id') projectId: number,
    @Body() body: updateProjectDto,
    @User() user: IUser,
  ) {
    return this.projectService.updateProject(projectId, body, user.id);
  }

  @Delete()
  @Roles(ERole.ADMIN)
  deleteUserOutProject(
    @Query('userId') userId: number,
    @Query('projectId') projectId: number,
    @User() user: IUser,
  ) {
    return this.projectService.deleteUserOutProject(userId, user.id, projectId);
  }

  @Delete(':id')
  @Roles(ERole.ADMIN)
  deleteProject(@Param('id') id: number, @User() user: IUser) {
    return this.projectService.deleteProject(id, user.id);
  }
}
