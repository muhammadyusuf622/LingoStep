import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './modules/auth/auth.module';
import * as path from 'path';
import { JwtHelper } from './helpers';
import { APP_GUARD } from '@nestjs/core';
import { CheckAuthGuard, CheckRoleGuard } from './guards';
import { ChatModule } from './modules';
import { BooksModule } from './modules/books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    PrismaModule,

    AuthModule,

    ChatModule,

    BooksModule
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
