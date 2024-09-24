import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionProjectEntity, ProjectEntity } from 'src/database/entities';
import { Repository } from 'typeorm';
import { createProjectDto } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectEntity: Repository<ProjectEntity>,
    @InjectRepository(PermissionProjectEntity)
    private readonly permissionProjectEntity: Repository<PermissionProjectEntity>,
  ) {}

  async list() {
    return this.projectEntity.findAndCount();
  }

  async create(id: number, payload: createProjectDto) {
    const project = { ...payload, createdId: id };

    await this.projectEntity.insert(project);

    const permissionProject = {
      createId: id,
      userId: id,
      projectId: (project as ProjectEntity).id,
      permission: { test: true },
    };

    await this.permissionProjectEntity.insert(permissionProject);

    return { message: 'success' };
  }
}
