import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { VideoChatService } from "./videoChat.service";
import { Protected, Roles } from "src/decaratores";
import { UserRoles } from "@prisma/client";
import { Ack } from "../../common"



@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS,
  },
})
export class EventGateway {
  @WebSocketServer()
  server: Server

  constructor(private readonly service: VideoChatService) {}

  async handleConnection(client: Socket){
    return await this.service.handleConnection(client)
  }


  @SubscribeMessage('newOffer')
  @Protected(false)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  async newOffer (@MessageBody() data: any){
    return await this.service.newOffer(data);
  }

@SubscribeMessage('newAnswer')
@Protected(false)
@Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
async newAnswer(
  @MessageBody() offerObj: any,
  @ConnectedSocket() client: Socket,
  @Ack() ack: (...args: any[]) => void,
) {
  return await this.service.newAnswer(offerObj, ack, this.server);
}


  @SubscribeMessage('sendIceCandidateToSignalingServer')
  @Protected(false)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  async sendIceCandidateToSignalingServer(@MessageBody() iceCandidateObj:any){
    return await this.service.sendIceCandidateToSignalingServer(iceCandidateObj);
  }

  @SubscribeMessage('hungUpPhone')
  @Protected(false)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  async hungUpPhone(@MessageBody() data: any){
    return await this.service.hungUpPhone(data);
  }
}