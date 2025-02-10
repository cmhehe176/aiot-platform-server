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
  SensorEntity,
  SubDevice,
} from 'src/database/entities'
import { DataSource, Repository } from 'typeorm'
import { ProjectService } from '../project/project.service'
import { UpdateSubDeviceDto } from './device.dto'
import { RabbitMqService } from '../rabbit-mq/rabbit-mq.service'
import { syncDataSubDevice } from 'src/common/util'
import { QueueInfo } from 'src/common/type'

@Injectable()
export class DeviceService {
  private readonly sensorEntity: Repository<SensorEntity>
  private readonly permissionProjectEntity: Repository<PermissionProjectEntity>

  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceEntity: Repository<DeviceEntity>,

    @InjectRepository(SubDevice)
    private readonly subDevice: Repository<SubDevice>,

    private readonly projectService: ProjectService,
    private readonly dataSource: DataSource,
    private readonly rabitmqService: RabbitMqService,
  ) {
    this.sensorEntity = this.dataSource.getRepository(SensorEntity)
    this.permissionProjectEntity = this.dataSource.getRepository(
      PermissionProjectEntity,
    )
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

    const checkUser = await this.permissionProjectEntity.exists({
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
      relations: { device: true },
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

  updateSubDevice = async (id: number, payload: UpdateSubDeviceDto) => {
    syncDataSubDevice(this.sensorEntity, this.subDevice)

    const subDeviceEntity = await this.subDevice.findOne({
      where: { id },
      relations: { device: true },
    })

    const listQueue = (await this.rabitmqService.getQueues()) as QueueInfo[]

    if (
      !listQueue.some((queue) =>
        queue.name.includes(subDeviceEntity.device?.deviceId),
      )
    ) {
      throw new BadRequestException('DeviceId queue not exist or not Active')
    }

    if (payload.type === 'sensor') {
      this.rabitmqService.sendMessage(
        {
          message_type: 'workflow',
          payload: {
            type: 'sensor_limit',
            sensor_list: [
              {
                sensor_name: subDeviceEntity.name,
                lower_limit: payload.lower_limit,
                upper_limit: payload.upper_limit,
              },
            ],
          },
        },
        subDeviceEntity.device.deviceId,
      )
    }

    if (payload.type === 'camera') {
      const baseMessage = {
        message_type: 'workflow',
        payload: {},
      }

      if (payload.detection_timer) {
        const timerMessage = {
          ...baseMessage,
          payload: {
            type: 'detection_timer',
            seconds: payload.detection_timer,
          },
        }

        this.rabitmqService.sendMessage(
          timerMessage,
          subDeviceEntity.device.deviceId,
        )
      }

      if (payload.selected_area) {
        const areaMessage = {
          ...baseMessage,
          payload: {
            type: 'detection_range',
            list_of_setpoint: payload.selected_area,
          },
        }

        this.rabitmqService.sendMessage(
          areaMessage,
          subDeviceEntity.device.deviceId,
        )
      }
    }

    return this.subDevice.update({ id }, payload)
  }
}
