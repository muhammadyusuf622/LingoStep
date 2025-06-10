import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '@prisma/client';
import { PROTECTED_KEY } from 'src/decaratores/protected.decorator';
import { JwtHelper } from 'src/helpers';
import { Response } from 'express';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();
    const request: any = ctx.getRequest<
      Request & { role?: UserRoles; userId: string }
    >();

    if (!isProtected) {
      request.role = UserRoles.USER;
      return true;
    }

    const tokenCookie = request.cookies?.refreshToken;
    const accsessToken = request.cookies?.accessToken;

    if (!tokenCookie) {
      throw new BadRequestException('token_not_found');
    }

    const data = await this.jwt.verifyToken(tokenCookie);
    request.userId = data?.id;
    request.role = data?.role;

    if (!accsessToken) {
      const tokenPayload = {
        id: data?.id,
        role: data?.role,
      };

      const token = await this.jwt.generateToken(tokenPayload);

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15,
      });

      res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    return true;
  }
}
