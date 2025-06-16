import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './modules/auth/auth.module';
import * as path from 'path';
import { APP_GUARD } from '@nestjs/core';
import { CheckAuthGuard, CheckRoleGuard } from './guards';
import { BotModule, ChatModule } from './modules';
import { BooksModule } from './modules/books/books.module';
import { PagesModule } from './modules/pages/pages.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { ScheduleModule } from '@nestjs/schedule';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuizQuiestionModule } from './modules/quiz-quiestion/quiz-quiestion.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN as string
    }),

    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    ScheduleModule.forRoot(),

    PrismaModule,

    AuthModule,

    ChatModule,

    BooksModule,

    PagesModule,

    BotModule,

    QuizModule,

    QuizQuiestionModule,

  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: CheckAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: CheckRoleGuard
    }
  ]

})
export class AppModule {}
