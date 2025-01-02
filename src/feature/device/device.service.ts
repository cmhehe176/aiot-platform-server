import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NRoles } from 'src/common/constants/roles.constant'
import { IUser } from 'src/common/decorators/user.decorator'
import {
  DeviceEntity,
  PermissionProjectEntity,
  SubDevice,
} from 'src/database/entities'
import { DataSource, Repository } from 'typeorm'
import { ProjectService } from '../project/project.service'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceEntity: Repository<DeviceEntity>,

    @InjectRepository(SubDevice)
    private readonly subDevice: Repository<SubDevice>,

    private readonly projectService: ProjectService,
    private readonly dataSource: DataSource,
  ) {}

  UpdateDevice = async (payload: any, id: number) => {
    await this.deviceEntity.update(
      { id: id },
      { name: payload.name, projectId: payload.projectId },
    )

    return { message: 'success' }
  }

  getListDevice = async (user: IUser, projectId?: number) => {
    if (!projectId && user.role.id === NRoles.USER)
      throw new ForbiddenException('Not have permission')

    if (!projectId)
      return this.deviceEntity.find({
        relations: { project: true },
        order: {
          createdAt: 'DESC',
        },
      })

    const checkUser = await this.dataSource
      .getRepository(PermissionProjectEntity)
      .exists({
        where: { userId: user.id, projectId: projectId },
      })

    if (!checkUser && user.role.id === NRoles.USER)
      throw new BadRequestException('Not Found device in project ')

    return this.deviceEntity.find({
      where: { projectId },
      relations: { project: true },
      order: {
        createdAt: 'DESC',
      },
    })
  }

  getListDeviceFree = () => {
    return this.deviceEntity
      .createQueryBuilder('device')
      .where('device.projectId IS NULL')
      .getMany()
  }

  getSubDevice = async (type, user: IUser, select?: any) => {
    if (type === 'all') type = undefined

    const listSubDevice = await this.subDevice.find({
      where: { type },
      select,
      order: { id: 'ASC' },
    })

    if (user.role.id === NRoles.ADMIN) return listSubDevice

    const accessibleDevices = listSubDevice.filter(
      (device) =>
        device.permissions &&
        Array.isArray(device.permissions) &&
        device.permissions.includes(user.id),
    )

    return accessibleDevices
  }

  updateSubDevice = (id: number, payload: SubDevice) => {
    return this.subDevice.update({ id }, { ...payload })
  }
}
