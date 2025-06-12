import { Module } from "@nestjs/common";
import { EventsGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { PrismaService } from "src/prisma";
import { ChatController } from "./chat.controller";


@Module({
  controllers: [ChatController],
  providers: [EventsGateway, ChatService, PrismaService]
})

export class ChatModule{};