import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionProjectEntity, ProjectEntity } from 'src/database/entities';
import { Repository } from 'typeorm';
import { createProjectDto } from './project.dto';
import { NRoles } from 'src/common/constants/roles.constant';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectEntity: Repository<ProjectEntity>,
    @InjectRepository(PermissionProjectEntity)
    private readonly permissionProjectEntity: Repository<PermissionProjectEntity>,
  ) {}

  async listProjectOfUser(id: number) {
    const [items, total] = await this.permissionProjectEntity.findAndCount({
      where: { userId: id },
      relations: { project: true, createdBy: true },
    });

    const data = items.map((item) => {
      return {
        project: item.project,
        permission: item.permission,
        createdBy: {
          roleId: item.createdBy?.role,
          id: item.createdBy?.id,
          name: item.createdBy?.name,
          email: item.createdBy?.email,
          telephone: item.createdBy?.telephone,
        },
      };
    });

    return { data, total };
  }

  async create(id: number, payload: createProjectDto) {
    const project = {
      name: payload.name,
      description: payload.description,
      createdId: id,
    };

    await this.projectEntity.insert(project);

    const permissionProject = {
      createdId: id,
      userId: id,
      projectId: (project as ProjectEntity).id,
      permission: { read: true, create: true, delete: true, update: true },
    };

    const promises = [this.permissionProjectEntity.insert(permissionProject)];

    if (payload.userId) {
      const userPromises = payload.userId.map((userId) =>
        this.addUserToProject(userId, id, (project as ProjectEntity).id),
      );

      promises.push(...userPromises);
    }

    await Promise.all(promises.map((promise) => promise));

    return { message: 'success' };
  }

  async listUserOfProject(id: number) {
    const [items, total] = await this.permissionProjectEntity.findAndCount({
      where: { projectId: id },
      relations: { user: true },
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          telephone: true,
          roleId: true,
        },
      },
    });

    return {
      data: items
        .map((item) => item.user)
        .filter((item) => item.roleId !== NRoles.ADMIN),
      total,
    };
  }

  addUserToProject(userId: number, adminId: number, projectId: number) {
    const permissionProject = {
      createdId: adminId,
      userId: userId,
      projectId: projectId,
      permission: { read: true },
    };

    return this.permissionProjectEntity.insert(permissionProject);
  }
}
