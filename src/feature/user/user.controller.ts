import { Controller, Get, Param } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('role/:id')
  getListUserByRole(@Param('id') id: number) {
    return this.userService.getListUserByRole(id)
  }

  @Get()
  getAllUser() {
    return this.userService.getAllUser()
  }
}
