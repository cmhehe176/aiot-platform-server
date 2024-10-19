import { Controller, Post } from '@nestjs/common'
import { MessageService } from './message.service'
import { Public } from 'src/common/decorators/public.decorator'

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Public()
  @Post('poll')
  sendPoll() {
    return this.messageService.sendPoll('7616244643')
  }

  @Public()
  @Post('mess')
  sendMess() {
    //-1002345395149
    return this.messageService.sendMessageToUser('7616244643', 'hello')
  }
}
