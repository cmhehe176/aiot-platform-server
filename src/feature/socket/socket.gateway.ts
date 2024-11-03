import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { SocketService } from './socket.service'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  namespace: 'socket',
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(private readonly socketService: SocketService) {}
  @WebSocketServer()
  server: Server

  afterInit() {
    console.log('Server initialized')
  }

  handleConnection(client: Socket) {
    console.log('Client connected ' + client.id)
  }

  sendEmit(even: string, data?: any) {
    return this.server.emit(even, data)
  }
}
