import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, { cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    try {
      client.emit('Connected!', { status: 'good' });
      console.log(`Client connected: ${client.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  broadcastNewData(data: any) {
    this.server.emit('newResponse', data);
  }
}
