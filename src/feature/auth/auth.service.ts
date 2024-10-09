import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities';
import { Repository } from 'typeorm';
import { ForgotPassword, Register, UpdateUserDto } from './auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { SourceMailForgotPassword } from 'src/feature/email/email.source';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/common/decorators/user.decorator';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async login(user: UserEntity) {
    const payload = {
      name: user.name,
      email: user.email,
      telephone: user.telephone,
      roleId: user.roleId,
    };

    return { accessToken: await this.jwtService.sign(payload) };
  }

  async register(data: Register) {
    const checkUser = await this.userEntity
      .createQueryBuilder('user')
      .where('user.email = :email', { email: data.email })
      .orWhere('user.telephone = :telephone', { telephone: data.telephone })
      .getExists();

    if (checkUser) throw new BadRequestException('User already exist');

    data.password = await argon.hash(data.password);

    await this.userEntity.insert(data);

    return { message: 'success' };
  }

  async forgotPassword(payload: ForgotPassword) {
    const user = await this.userEntity.findOne({
      where: { email: payload.email },
    });

    if (!user) throw new NotFoundException('User not exist or has been band');

    const { accessToken } = await this.login(user);

    const data = {
      subject: 'Forgot Password',
      data: {
        name: user.name,
        link: `${this.configService.get<string>('END_POINT_HOST')}/reset-password/${accessToken}`,
      },
      to: [payload.email],
      html: SourceMailForgotPassword,
    };

    await this.emailService.sendMail(data);

    return { message: 'success' };
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
    );

    return { message: 'success' };
  }

  async verify(username: string, password: string) {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .where('user.email = :username', { username })
      .orWhere('user.telephone = :username', { username })
      .getOne();

    if (!user) throw new BadRequestException(' No match User');

    const checkPassword = await argon.verify(user.password, password);

    if (!checkPassword) throw new BadRequestException('No match Password');

    return user;
  }

  async getProfile(id: number) {
    const user = await this.userEntity
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();

    if (!user) throw new NotFoundException('User not exist or has been band');

    delete user.password;

    return { profile: user };
  }
}
