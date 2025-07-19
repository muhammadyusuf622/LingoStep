import { Module } from "@nestjs/common";
import { EventGateway } from "./videoChat.gateway";
import { VideoChatService } from "./videoChat.service";
import { PrismaService } from "src/prisma";


@Module({
  providers: [EventGateway, VideoChatService, PrismaService],
  exports: [VideoChatService]
})

export class VideoChatModule {};