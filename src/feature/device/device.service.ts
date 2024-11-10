import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NRoles } from 'src/common/constants/roles.constant'
import { IUser } from 'src/common/decorators/user.decorator'
import { DeviceEntity, PermissionProjectEntity } from 'src/database/entities'
import { Repository } from 'typeorm'
import { SocketGateway } from '../socket/socket.gateway'
import { ProjectService } from '../project/project.service'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceEntity: Repository<DeviceEntity>,
    @InjectRepository(PermissionProjectEntity)
    private readonly permissionProjectEntity: Repository<PermissionProjectEntity>,
    private readonly socket: SocketGateway,
    private readonly projectService: ProjectService,
  ) {}

  CreateDevice = async (payload: any, adminId: number) => {
    const data = { ...payload, createdId: adminId }

    await this.deviceEntity.insert(data)

    return { message: 'success' }
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
        order: {
          createdAt: 'DESC',
        },
      })

    const checkUser = await this.permissionProjectEntity.exists({
      where: { userId: user.id, projectId: projectId },
    })

    if (!checkUser && user.role.id === NRoles.USER)
      throw new BadRequestException('Not Found device in project ')

    return this.deviceEntity.find({
      where: { projectId },
      order: {
        createdAt: 'DESC',
      },
    })
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

  sendDataUpdate = () => {
    return this.socket.sendEmit('test', true)
  }
}
