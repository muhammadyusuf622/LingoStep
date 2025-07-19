import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { AdminMessageService } from './message.service';
import { Protected, Roles } from 'src/decaratores';
import { UserRoles } from '@prisma/client';
import { Request } from 'express';
import { ReplyMessageDto } from './dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin-message')
export class AdminMessageController {
  constructor(private readonly service: AdminMessageService) {}

  @Get()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async getAll() {
    return await this.service.getAll();
  }

  @Get('getAllUserId')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async getAllWithUserId(@Req() req: Request & { userId: string }) {
    return await this.service.getAllWithUserId(req);
  }

  @Get('getPanding')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async getOnlyUnanswered() {
    return await this.service.getOnlyUnanswered();
  }

  @Post()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  async createWithUser(
    @Body() body: any,
    @Req() req: Request & { userId: string },
  ) {
    return await this.service.createWithUser(body, req);
  }

  @Post('reply-user')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async replyToTheUser(@Body() body: ReplyMessageDto) {
  return await this.service.replyToTheUser(body);
  }
}
