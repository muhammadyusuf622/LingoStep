import { Controller, Get } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Protected, Roles } from "src/decaratores";
import { UserRoles } from "@prisma/client";




@Controller('chat')
export class ChatController{
  constructor(private readonly service: ChatService) {};

  @Get()
  @Protected(true)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async getAllMessage(){
    return await this.service.getAllMessage();
  }
}