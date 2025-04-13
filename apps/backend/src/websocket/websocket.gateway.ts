import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * This is the WebSocket Gateway that handles live updates to the frontend.
 * The port is set to 3001 as to have no interferance with the backend port (3002) or frontend port (3001)
 */
@WebSocketGateway(3001, { cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
