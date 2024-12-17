import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { SocketService } from './socket.service'
import { Server } from 'socket.io'

@WebSocketGateway({
  namespace: 'socket',
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(private readonly socketService: SocketService) {}
  @WebSocketServer()
  server: Server

  sendEmit(even: string, data?: any) {
    return this.server.emit(even, data)
  }
}
