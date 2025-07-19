import { Module } from "@nestjs/common";
import { AdminMessageController } from "./message.controller";
import { AdminMessageService } from "./message.service";
import { PrismaService } from "src/prisma";



@Module({
  controllers: [AdminMessageController],
  providers: [AdminMessageService, PrismaService]
})
export class AdminMessageModule{};