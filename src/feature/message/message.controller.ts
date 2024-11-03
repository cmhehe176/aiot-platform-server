import { Controller, Post } from '@nestjs/common'
import { MessageService } from './message.service'
import { Public } from 'src/common/decorators/public.decorator'
import { PollDto } from './message.dto'

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Public()
  @Post('poll')
  sendPoll() {
    const data: PollDto = {
      question: 'Bạn có thích dùng sản phẩm của chúng tôi không?',
      options: ['Có', 'Không'],
      explanation:
        'Cảm ơn bạn đã tham gia! <b>AIot Platform</b> là sản phẩm xịn nhất trên thế giới!',
    }

    return this.messageService.sendPoll('-1002345395149', data)
  }

  @Public()
  @Post('send-message')
  sendMessage() {
    //-1002345395149
    return this.messageService.sendMessageToUser('7616244643', 'hello')
  }

  @Public()
  @Post('send-image')
  sendImage() {
    //-1002345395149

    return this.messageService.sendPhoto(
      '7616244643',
      'https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-1035x780.jpg',
      'anh conmeo',
    )
  }
}
