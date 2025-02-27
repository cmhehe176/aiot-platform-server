import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as argon from 'argon2'
import { IUser } from 'src/common/decorators/user.decorator'
import { UserEntity } from 'src/database/entities'
import { SourceMailForgotPassword } from 'src/feature/email/email.source'
import { Repository } from 'typeorm'
import { EmailService } from '../email/email.service'
import { ForgotPassword, Register } from './auth.dto'
import { ProjectService } from '../project/project.service'
import { NRoles } from 'src/common/constants/roles.constant'
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
    private readonly projectService: ProjectService,
  ) {}

  async login(user: UserEntity) {
    const payload = {
      name: user.name,
      email: user.email,
      telephone: user.telephone,
      roleId: user.roleId,
    }

    return { accessToken: await this.jwtService.sign(payload) }
  }

  async register(data: Register) {
    const checkUser = await this.userEntity
      .createQueryBuilder('user')
      .where('user.email = :email', { email: data.email })
      .orWhere('user.telephone = :telephone', { telephone: data.telephone })
      .getExists()

    if (checkUser) throw new BadRequestException('User already exist')

    data.password = await argon.hash(data.password)

    await this.userEntity.insert(data)

    return { message: 'success' }
  }

  async forgotPassword(payload: ForgotPassword) {
    const user = await this.userEntity.findOne({
      where: { email: payload.email },
    })

    if (!user) throw new NotFoundException('User not exist or has been band')

    const data = {
      subject: 'Forgot Password',
      data: {
        name: user.name,
        link: `${this.configService.get<string>('END_POINT_HOST')}/reset-password/${this.jwtService.sign({ ...user }, { expiresIn: '30m' })}`,
      },
      to: [payload.email],
      html: SourceMailForgotPassword,
    }

    return this.emailService.sendMail(data)
  }

  // async update(data: UpdateUserDto, user: IUser) {

  //   if(user.email ===data.email)

  //   const checkEmail = await this.userEntity.existsBy({ email: data.email });

  //   if (checkEmail) throw new BadRequestException('Email already exist');

  //   const checkTelephone = await this.userEntity.existsBy({
  //     telephone: data.telephone,
  //   });

  //   if (checkTelephone)
  //     throw new BadRequestException('Telephone already exist');

  //   const user2 = await this.userEntity.update({ id: user.id }, data);

  //   return data;
  // }

  async updatePassword(password: string, user: IUser) {
    await this.userEntity.update(
      { id: user.id },
      { password: await argon.hash(password) },
    )

    return { message: 'success' }
  }

  async verify(username: string, password: string) {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .where('user.email = :username', { username })
      .orWhere('user.telephone = :username', { username })
      .getOne()

    if (!user) throw new BadRequestException(' No match User')

    const checkPassword = await argon.verify(user.password, password)

    if (!checkPassword) throw new BadRequestException('No match Password')

    return user
  }

  async getProfile(id: number) {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.permissionProject', 'permissionProject')
      .leftJoinAndSelect('permissionProject.project', 'project')
      .leftJoinAndSelect('project.device', 'device')
      .where('user.id = :id', { id })
      .orderBy('project.id', 'ASC')
      .getOne()

    // return user

    if (!user) throw new NotFoundException('User not exist or has been band')

    const profile = {
      ...user,
      project:
        user.roleId === NRoles.USER
          ? user.permissionProject.map((p) => p.project)
          : await this.projectService.listProject(),
    }

    delete profile.password
    delete profile.permissionProject

    return { profile }
  }
}
