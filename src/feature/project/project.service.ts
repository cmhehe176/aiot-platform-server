import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionProjectEntity, ProjectEntity } from 'src/database/entities';
import { Repository } from 'typeorm';
import { createProjectDto, updateProjectDto } from './project.dto';
import { NRoles } from 'src/common/constants/roles.constant';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectEntity: Repository<ProjectEntity>,
    @InjectRepository(PermissionProjectEntity)
    private readonly permissionProjectEntity: Repository<PermissionProjectEntity>,
  ) {}

  async listProjectByUser(id: number) {
    const [items, total] = await this.permissionProjectEntity.findAndCount({
      where: { userId: id },
      relations: { project: true, createdBy: true },
    });

    const data = items.map((item) => {
      return {
        id: item.id,
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

    if (payload.userIds) {
      const userPromises = payload.userIds.map((userId) =>
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

  async updateProject(
    projectId: number,
    payload: updateProjectDto,
    adminId: number,
  ) {
    const { data } = await this.listUserOfProject(projectId);
    const promises = [];
    const listUserInProject = data.map((item) => item.id);

    promises.push(
      this.projectEntity.update(
        { id: projectId },
        { name: payload.name, description: payload.description },
      ),
    );

    const addUser = payload.userIds.map((userId) => {
      if (listUserInProject.includes(userId)) return;

      this.addUserToProject(userId, adminId, projectId);
    });

    const dropUser = listUserInProject
      .filter((i) => !payload.userIds.includes(i))
      .map((userId) => this.deleteUserOutProject(userId, adminId, projectId));

    promises.push(...addUser, ...dropUser);

    await Promise.all(promises.map((p) => p));

    return { message: 'success' };
  }

  async deleteProject(id: number, adminId: number) {
    const promise = [
      this.permissionProjectEntity.update(
        { projectId: id },
        { deletedId: adminId },
      ),
      this.permissionProjectEntity.softDelete({ projectId: id }),

      this.projectEntity.update({ id }, { deletedId: adminId }),
      this.projectEntity.softDelete({ id: id }),
    ];

    await Promise.all(promise.map((p) => p));

    return { message: 'success' };
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

  deleteUserOutProject(userId: number, adminId: number, projectId: number) {
    this.permissionProjectEntity
      .softDelete({
        userId: userId,
        projectId: projectId,
      })
      .then(() =>
        this.permissionProjectEntity.update(
          {
            userId: userId,
            projectId: projectId,
          },
          { deletedId: adminId },
        ),
      );

    return { message: 'success' };
  }
}
