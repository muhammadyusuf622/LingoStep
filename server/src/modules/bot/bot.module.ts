import { Module } from "@nestjs/common";
import { BotUpdate } from "./bot.update";
import { Telegraf } from "telegraf";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma";



@Module({
  providers: [BotUpdate, PrismaService,
    {
      provide: Telegraf,
      inject: [ConfigService],
      useFactory: () => new Telegraf(process.env.BOT_TOKEN as string)
    }
  ]
})

export class BotModule{};