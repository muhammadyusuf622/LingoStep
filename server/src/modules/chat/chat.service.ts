import { BadRequestException, Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { PrismaService } from "src/prisma";
import { IntMessage } from "./interface";
import { isUUID } from 'validator';


@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {};


  async hearingEvents(data: IntMessage, soket: Server){

    try {
          if (!isUUID(data?.userId)) {
            throw new BadRequestException('Bad Request');
          }

          const foundUser = await this.prisma.user.findFirst({
            where: { id: data.userId },
          });

          const newMessage = await this.prisma.chat.create({
            data: {
              username: foundUser?.username as string,
              message: data.message,
            },
          });

          const date = new Date(newMessage.createdAt);
          const formatted = date.toLocaleString('uz-UZ');

          const user = {
            userId: foundUser?.id,
            username: newMessage.username,
            message: newMessage.message,
            createAt: formatted,
          };
          soket.emit('events', user);

          return { message: 'success' };
    } catch (error) {
          soket.emit('error', {
            message: error?.message || 'Something went wrong',
          });
          return;
    }
  }

  async getAllMessage(){

    const messages = await this.prisma.chat.findMany()

    const data = messages.map((chat) => {
      const date = new Date(chat.createdAt);
      const formatted = date.toLocaleString('uz-UZ');
      return {
        ...chat,
        createdAt: formatted
      }
    });

    return {
      message: "success",
      data: data
    }
  }
}