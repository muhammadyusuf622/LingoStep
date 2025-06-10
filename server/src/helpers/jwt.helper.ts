import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserRoles } from "@prisma/client";

@Injectable()
export class JwtHelper{
  constructor(private readonly jwt: JwtService) {};

  async generateToken(payload: {id: string, role: UserRoles}) {

    const token = await this.jwt.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: process.env.ACCESS_SECRET_TIME,
    });

    return token;
  }

  async verifyToken(token: string) {

    try {
      const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY
      const openToken = await this.jwt.verifyAsync(token, {secret: secretKey});
      return openToken;
    } catch (error) {

      if(error instanceof JsonWebTokenError){
        throw new BadRequestException('token_not_found');
      }

      if(error instanceof TokenExpiredError) {
        throw new ForbiddenException('token time out');
      }

      throw new InternalServerErrorException('server error');
    }
  }
}