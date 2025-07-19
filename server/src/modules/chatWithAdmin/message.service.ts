import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma';
import { ReplyMessageDto } from './dto';
import { isUUID } from 'validator';

@Injectable()
export class AdminMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const data = await this.prisma.adminMessage.findMany();

    return {
      message: 'success',
      data: data,
    };
  }

  async getOnlyUnanswered() {
    const data = await this.prisma.adminMessage.findMany({
      where: { status: 'pending' },
    });

    return {
      message: 'success',
      data: data,
    };
  }

  async getAllWithUserId(req: Request & { userId: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.userId },
    });
    const data = await this.prisma.adminMessage.findMany({
      where: { userId: req.userId },
    });

    return {
      message: 'success',
      data: data,
      userImg: (process.env.BACKEND_URL as string) + user?.imgUrl,
    };
  }

  async createWithUser(payload: any, req: Request & { userId: string }) {
    const id = req.userId;

    if (!payload.message) {
      throw new BadRequestException('message not found');
    }

    await this.prisma.adminMessage.create({
      data: {
        userId: id,
        message: payload.message,
      },
    });

    return {
      message: 'success',
    };
  }

  async replyToTheUser(payload: ReplyMessageDto) {

    if(!isUUID(payload.rowId)){
      throw new BadRequestException('Id Error Format');
    }

    const foundMessage = await this.prisma.adminMessage.findUnique({where: {id: payload.rowId}});

    if(!foundMessage || foundMessage.status != 'pending'){
      throw new NotFoundException('message not found');
    }

    const updateMessage = await this.prisma.adminMessage.update({where: {id: payload.rowId}, data: {
      adminMessage: payload.adminMessage,
      status: payload.status
    }})

    return {
      message: 'success',
      data: updateMessage
    };
  }
}
