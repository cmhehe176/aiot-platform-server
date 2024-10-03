import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NRoles } from 'src/common/constants/roles.constant';
import { IUser } from 'src/common/decorators/user.decorator';
import { DeviceEntity, PermissionProjectEntity } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceEntity: Repository<DeviceEntity>,
    @InjectRepository(PermissionProjectEntity)
    private readonly permissionProjectEntity: Repository<PermissionProjectEntity>,
  ) {}

  CreateDevice = async (payload: any, adminId: number) => {
    const data = { ...payload, createdId: adminId };

    await this.deviceEntity.insert(data);

    return { message: 'success' };
  };

  UpdateDevice = async (payload: any, id: number) => {
    await this.deviceEntity.update(
      { id: id },
      { name: payload.name, isActive: payload.isActive },
    );

    return { message: 'success' };
  };

  getListDevice = async (user: IUser, projectId: number) => {
    if (user.role.id === NRoles.USER) {
      const checkUser = await this.permissionProjectEntity.exists({
        where: { userId: user.id, projectId: projectId },
      });

      if (!checkUser)
        throw new BadRequestException('Not Found device in  project ');

      return this.deviceEntity.find({ where: { projectId } });
    }

    return this.deviceEntity.find();
  };
}
