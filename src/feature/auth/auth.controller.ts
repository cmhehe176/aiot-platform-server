import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Register } from './auth.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { IUser, User } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  Login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  Register(@Body() data: Register) {
    return this.authService.register(data);
  }

  @Get()
  getProfile(@User() user: IUser) {
    return this.authService.getProfile(user.id);
  }
}
