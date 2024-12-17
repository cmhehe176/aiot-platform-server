import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NRoles } from 'src/common/constants/roles.constant'
import { IUser } from 'src/common/decorators/user.decorator'
import { DeviceEntity, PermissionProjectEntity } from 'src/database/entities'
import { DataSource, Repository } from 'typeorm'
import { ProjectService } from '../project/project.service'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceEntity: Repository<DeviceEntity>,

    private readonly projectService: ProjectService,
    private readonly dataSource: DataSource,
  ) {}

  CreateDevice = (payload: any, adminId: number) => {
    const data = { ...payload, createdId: adminId }

    return this.deviceEntity.insert(data).catch(console.error)
  }

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

  getDeviceOfUser = async (user: IUser) => {
    const list = await this.projectService.getListProjectByRole(user)

    return list.flatMap((i) =>
      i.device.map((i) => {
        return {
          id: i.id,
          name: i.name,
        }
      }),
    )
  }
}
