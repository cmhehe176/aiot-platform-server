import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ProjectService } from './project.service'
import { createProjectDto, updateProjectDto } from './project.dto'
import { IUser, User } from 'src/common/decorators/user.decorator'
import { ERole, Roles } from 'src/common/decorators/role.decorator'

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  listProjectByUser(@User() user: IUser) {
    return this.projectService.listProjectByUser(user.id)
  }

  @Get('dashboard/list')
  getListProjectByRole(@User() user: IUser) {
    return this.projectService.getListProjectByRole(user)
  }

  @Get('list')
  @Roles(ERole.ADMIN)
  listProject(@Query() query: { q?: string }) {
    return this.projectService.listProject(query.q)
  }

  @Get(':id')
  listUserOfProject(@Param('id') id: number) {
    return this.projectService.listUserOfProject(id)
  }

  @Post()
  @Roles(ERole.ADMIN)
  Create(@Body() body: createProjectDto, @User() user: IUser) {
    return this.projectService.create(user.id, body)
  }

  @Put(':id')
  @Roles(ERole.ADMIN)
  Update(
    @Param('id') projectId: number,
    @Body() body: updateProjectDto,
    @User() user: IUser,
  ) {
    return this.projectService.updateProject(projectId, body, user.id)
  }

  @Delete()
  @Roles(ERole.ADMIN)
  deleteUserOutProject(
    @Query() query: { userId: number; projectId: number },
    @User() user: IUser,
  ) {
    return this.projectService.deleteUserOutProject(
      query.userId,
      user.id,
      query.projectId,
    )
  }

  @Delete(':id')
  @Roles(ERole.ADMIN)
  deleteProject(@Param('id') id: number) {
    return this.projectService.deleteProject(id)
  }
}
