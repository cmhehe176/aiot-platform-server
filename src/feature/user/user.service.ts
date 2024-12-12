import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/database/entities'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  async getListUserByRole(roleId: number) {
    const [items, total] = await this.userEntity.findAndCount({
      where: { roleId: roleId },
      select: [
        'id',
        'name',
        'email',
        'createdAt',
        'updatedAt',
        'roleId',
        'thumbnailUrl',
        'telephone',
      ],
    })

    return { items, total }
  }

  getAllUser() {
    return this.userEntity.find()
  }
}
