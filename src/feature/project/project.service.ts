import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  DeviceEntity,
  PermissionProjectEntity,
  ProjectEntity,
} from 'src/database/entities'
import { FindOptionsWhere, Like, Repository } from 'typeorm'
import { createProjectDto, updateProjectDto } from './project.dto'
import { NRoles } from 'src/common/constants/roles.constant'
import { IUser } from 'src/common/decorators/user.decorator'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectEntity: Repository<ProjectEntity>,

    @InjectRepository(PermissionProjectEntity)
    private readonly permissionProjectEntity: Repository<PermissionProjectEntity>,

    @InjectRepository(DeviceEntity)
    private readonly deviceEntity: Repository<DeviceEntity>,
  ) {}

  //can remove
  async listProjectByUser(id: number) {
    const [items, total] = await this.permissionProjectEntity.findAndCount({
      where: { userId: id },
      relations: { project: { device: true }, createdBy: true },
    })

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
      }
    })

    return { data, total }
  }

  async listProject(query?: string) {
    const where: FindOptionsWhere<ProjectEntity> = {
      name: Like(`%${query}%`),
    }

    const projects = await this.projectEntity.find({
      where: query ? where : null,
      relations: { createdBy: true, device: true },
      order: {
        id: 'ASC',
      },
    })

    projects.forEach((item) => delete item.createdBy.password)

    return projects
  }

  async create(id: number, payload: createProjectDto) {
    const project = {
      name: payload.name,
      description: payload.description,
      createdId: id,
    }

    await this.projectEntity.insert(project)

    const permissionProject = {
      createdId: id,
      userId: id,
      projectId: (project as ProjectEntity).id,
      permission: { read: true, create: true, delete: true, update: true },
    }

    const promises = [this.permissionProjectEntity.insert(permissionProject)]

    if (payload.userIds) {
      const userPromises = payload.userIds.map((userId) =>
        this.addUserToProject(userId, id, (project as ProjectEntity).id),
      )

      promises.push(...userPromises)
    }

    if (payload.deviceIds) {
      // khi dùng for await thì mỗi phần tử trong for sẽ phải chờ thằng trước chạy xong
      // => chậm => dùng map rồi ném vào Promise.all
      for (const devciceId of payload.deviceIds) {
        await this.deviceEntity.update(
          { id: devciceId },
          { projectId: (project as ProjectEntity).id },
        )
      }
    }

    await Promise.all(promises.map((promise) => promise))

    return { message: 'success' }
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
    })

    return {
      data: items.map((item) => item.user),
      total,
    }
  }

  async updateProject(
    projectId: number,
    payload: updateProjectDto,
    adminId: number,
  ) {
    const { data } = await this.listUserOfProject(projectId)

    const promises: any[] = [
      this.projectEntity.update(
        { id: projectId },
        { name: payload.name, description: payload.description },
      ),
    ]

    const listUserInProject = data.map((item) => item.id)

    if (payload.userIds) {
      const addUser = payload.userIds.map((userId) => {
        if (listUserInProject.includes(userId)) return false

        this.addUserToProject(userId, adminId, projectId)
      })

      const dropUser = listUserInProject
        .filter((i) => !payload.userIds.includes(i))
        .map((userId) => this.deleteUserOutProject(userId, adminId, projectId))

      promises.push(...addUser, ...dropUser)
    }

    if (payload.deviceIds) {
      const project = await this.getDetailProject(projectId)
      const listDeviceInProject = project.device.map((i) => i.id)

      const addDevice = payload.deviceIds.map((deviceId) => {
        if (listDeviceInProject.includes(deviceId)) return false

        this.deviceEntity.update({ id: deviceId }, { projectId: projectId })
      })

      const dropDevice = listDeviceInProject
        .filter((deviceid) => !payload.deviceIds.includes(deviceid))
        .map((deviceId) =>
          this.deviceEntity.update({ id: deviceId }, { projectId: null }),
        )

      promises.push(...addDevice, ...dropDevice)
    }

    await Promise.all(promises.map((p) => p))

    return true
  }

  async deleteProject(id: number) {
    await Promise.all([
      this.deviceEntity.update({ projectId: id }, { projectId: null }),

      this.permissionProjectEntity.delete({ projectId: id }),

      this.projectEntity.delete({ id: id }),
    ])

    return true
  }

  addUserToProject(userId: number, adminId: number, projectId: number) {
    const permissionProject = {
      createdId: adminId,
      userId: userId,
      projectId: projectId,
      permission: { read: true },
    }

    return this.permissionProjectEntity.insert(permissionProject)
  }

  deleteUserOutProject(userId: number, adminId: number, projectId: number) {
    return this.permissionProjectEntity
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
      )
  }

  getListProjectByRole = async (user: IUser) => {
    const isAdmin = user.role.id === NRoles.ADMIN

    const mapProjectDevices = (project) => {
      return {
        id: project.id,
        name: project.name,
        device: project.device.map((device) => ({
          id: device.id,
          name: device.name,
          deviceId: device.deviceId,
        })),
      }
    }

    if (isAdmin) {
      const projects = await this.listProject()
      return projects.map(mapProjectDevices)
    }

    const userProjects = await this.listProjectByUser(user.id)
    return userProjects.data.map((item) => mapProjectDevices(item.project))
  }

  getDetailProject = (id: number) => {
    return this.projectEntity.findOne({
      where: { id },
      relations: { device: true },
    })
  }
}
