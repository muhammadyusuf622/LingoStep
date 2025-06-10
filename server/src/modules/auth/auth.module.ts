import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma';
import { FaceBookStrategy, GithubStrategy, GoogleStrategy } from './strategy';
import { FileUpload, JwtHelper } from 'src/helpers';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.ACCESS_SECRET_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    GoogleStrategy,
    FaceBookStrategy,
    GithubStrategy,
    JwtHelper,
    FileUpload
  ],

  exports: [JwtHelper]
})
export class AuthModule {}
