import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import TelegramBot from 'node-telegram-bot-api'
import { EMAIL_PATTERN, generateRandomSixDigitNumber } from 'src/common/util'
import { UserEntity } from 'src/database/entities'
import { DataSource, Repository } from 'typeorm'
import { EmailService } from '../email/email.service'
import { InjectRepository } from '@nestjs/typeorm'
import { sendMailDto } from '../email/email.dto'
import { SourceMailSecretKey } from '../email/email.source'
import { PollDto } from './message.dto'

@Injectable()
export class MessageService {
  private readonly bot: TelegramBot
  private logger = new Logger(MessageService.name)
  private temp: { email: string; key: string } = { email: '', key: '' }
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
  ) {
    this.bot = new TelegramBot(
      this.configService.get<string>('API_BOT_TELEGRAM'),
      { polling: true },
    )

    this.bot.on('message', this.onReceiveMessage)
    this.bot.on('poll', this.onReceivePoll)

    //disable error polling_error message
    this.bot.on('polling_error', (e) => e)
    //ignore
    // this.sendMessageToUser('7616244643', `Server started at ${new Date()}`);
  }

  onReceiveMessage = async (msg: any) => {
    if (!msg.text) return
    //disable group chat
    if (msg.chat.type !== 'private') return

    if (msg.text.length === 9 && msg.text.startsWith('sec')) {
      if (!this.temp?.key)
        return this.sendMessageToUser(msg.from.id, 'Wrong code')

      if (!this.temp?.email)
        return this.sendMessageToUser(
          msg.from.id,
          'Please input your email again',
        )

      if (this.temp.key === msg.text)
        this.userEntity
          .update({ email: this.temp.email }, { telegramId: msg.from.id })
          .then(() =>
            this.sendMessageToUser(
              msg.from.id,
              `Done, hello ${msg.from.last_name}`,
            ),
          )
          .catch((e) => e)

      this.temp = { email: '', key: '' }

      return
    }

    try {
      const user = await this.userEntity.exists({
        where: { telegramId: msg.from.id },
      })

      if (!user) {
        if (EMAIL_PATTERN.test(msg.text)) {
          const checkUser = await this.userEntity
            .findOne({
              where: { email: msg.text },
            })
            .catch((err) => {
              throw err
            })

          if (!checkUser)
            return this.sendMessageToUser(
              msg.from.id,
              'You dont exist in my organization',
            )

          this.temp.email = msg.text

          try {
            const key = await generateRandomSixDigitNumber()
            this.temp.key = key

            const data: sendMailDto = {
              to: [msg.text],
              subject: 'Verify Telegram',
              data: {
                key: key,
                name: checkUser.name,
              },
              html: SourceMailSecretKey,
            }

            this.sendMessageToUser(msg.from.id, 'Please wait to sending email')

            await this.emailService.sendMail(data).catch((err) => {
              console.error('Error sending email:', err)
              throw err
            })
          } catch (error) {
            console.error(error)
          }

          return this.sendMessageToUser(
            msg.from.id,
            'Please check your email to input your key in here',
          )
        }

        this.bot.sendMessage(
          msg.from.id,
          'You must be verify if you want to accept notification, please enter your email bellow here',
        )

        return
      }

      if (msg.text === '/start') {
        this.sendMessageToUser(msg.from.id, 'hello')
        return
      }
    } catch (error) {
      console.error(error)
    }
  }

  onReceivePoll = (data) => {
    console.log(data)
  }

  sendMessageToUser = (userId: string, message: any) => {
    return this.bot.sendMessage(userId, message).catch(console.error)
  }

  sendPhoto(userId: string, photoPath: string, caption = '') {
    return this.bot
      .sendPhoto(userId, photoPath, { caption: caption })
      .catch(console.error)
  }

  sendPoll = (userId: string, data: PollDto) => {
    return this.bot
      .sendPoll(userId, data.question, data.options, {
        is_anonymous: false,
        allows_multiple_answers: false,
        type: 'regular',
        // explanation_parse_mode: 'HTML',
        // explanation: data.explanation,
      })
      .catch(console.error)
  }
}
