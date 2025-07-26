import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { Protected, Roles } from 'src/decaratores';
import { UserRoles } from '@prisma/client';
import { IntMessage } from './interface';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS,
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly service: ChatService) {}

  @SubscribeMessage('events')
  @Protected(false)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async hearingEvents(@MessageBody() data: IntMessage) {
    return await this.service.hearingEvents(data, this.server);
  }
}
