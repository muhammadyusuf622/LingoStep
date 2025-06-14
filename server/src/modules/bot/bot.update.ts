import { Cron } from '@nestjs/schedule';
import { UserRoles } from '@prisma/client';
import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Protected, Roles } from 'src/decaratores';
import { PrismaService } from 'src/prisma';
import { Context, Telegraf } from 'telegraf';

@Update()
@Protected(false)
@Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
export class BotUpdate {
  messageIdWord:number
  startId:any
  constructor(
    private readonly prisma: PrismaService,
    private readonly bot: Telegraf<any>,
  ) {};

  @Start()
  async start(@Ctx() ctx: Context) {
    const data = await ctx.reply('Please send your phone number 👇', {
      reply_markup: {
        keyboard: [
          [
            {
              text: '📞 Send number',
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });

    this.startId = ctx.message?.message_id
    this.messageIdWord = data.message_id;
  }

  @On('contact')
  async getPhoneNumber(@Ctx() ctx: Context & { message: any }) {
    try {
      const messageId = ctx.message.message_id;
      const contact = ctx.message.contact;
      const phone = contact.phone_number;
      const username = ctx.message.chat.username;
      const chatId = ctx.message.chat.id;
      const language_code = ctx.message.from.language_code;
      const message = `📚 Class time has started!
Good morning, knowledge seeker! Your lesson is waiting for you.
🕗 It's the perfect time to grow, learn, and chase your dreams.
🎯 Every step today brings you closer to your goals.
🔥 Let’s write another powerful page of your journey today!`;

      const send_message = `Thank you for sharing your details! 🎉
From now on, we'll be sending you daily reminders to help you stay on track and keep growing.
Get ready to start each day with motivation, purpose, and a step toward your goals! 🚀`;

      if(!username || !phone || !language_code || !chatId){
        ctx.reply(`You don't have enough information 😔`);
        await ctx.telegram.deleteMessage(chatId, this.messageIdWord);
        await ctx.telegram.deleteMessage(chatId, messageId);
        await ctx.telegram.deleteMessage(chatId, this.startId);
        return;
      }

      const data = await this.prisma.telegramNote.findUnique({where: {username: username}});

      if(data){
        ctx.reply(`You are already registered 😁`);
        await ctx.telegram.deleteMessage(chatId, this.messageIdWord);
        await ctx.telegram.deleteMessage(chatId, messageId);
        await ctx.telegram.deleteMessage(chatId, this.startId);
        return;
      }

      await this.prisma.telegramNote.create({data: {
        username: username,
        chatId: chatId,
        phone_number: phone,
        language_code: language_code,
        message: message
      }})

      ctx.reply('🤝');
      ctx.reply(send_message);

      await ctx.telegram.deleteMessage(chatId, this.messageIdWord);
      await ctx.telegram.deleteMessage(chatId, messageId);
      await ctx.telegram.deleteMessage(chatId, this.startId);

    } catch (error) {
      ctx.reply('something went wrong ❌');
      console.log(error.message);
    }
  }

  @On('message')
  async handleMessage(@Ctx() ctx: Context & { message: any }) {
    const messageId = ctx.message.message_id;

    try {
      await ctx.deleteMessage(messageId);
    } catch (error) {
      console.error('Xabarni o‘chirishda xatolik:', error);
    }

    await ctx.reply('Please do not write to the bot. The bot is only for sending notes 😊');
  }

  @Cron('0 8 * * *')
  async note(){

    const data = await this.prisma.telegramNote.findMany();

    for(const obj of data){
      try {
        const num = Number(obj.chatId);
        await this.bot.telegram.sendMessage(num, `🚀 `);
        await this.bot.telegram.sendMessage(num, `📖`);
        await this.bot.telegram.sendMessage(num, `${obj.message}`);
      } catch (error) {
        console.log("Yuborib bo'lmadi:", error.message);
      }
    }

  }
}
