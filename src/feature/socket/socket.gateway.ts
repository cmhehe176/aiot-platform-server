import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets'
import { SocketService } from './socket.service'
import { Socket } from 'socket.io'

@WebSocketGateway({
  namespace: 'socket',
  cors: {
    origin: 'http://localhost:4000',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly socketService: SocketService) {}

  afterInit() {
    console.log('Server initialized')
  }

  handleConnection(client: Socket) {
    console.log('Client connected ' + client.id)
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ' + client.id)
  }
}
