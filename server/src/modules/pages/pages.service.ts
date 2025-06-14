import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PrismaService } from 'src/prisma';
import { isUUID } from 'validator';
import { AudioFileUpload } from 'src/helpers';
import { Request } from 'express';
@Injectable()
export class PagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audioUpload: AudioFileUpload,
  ) {}

  async findAll() {
    const data = await this.prisma.writeBookTypeng.findMany();

    const newData = data.map((item) => {
      item.audio_url = (process.env.BACKEND_URL as string) + item.audio_url;
      return item;
    });

    return {
      message: 'success',
      data: newData,
    };
  }

  async create(payload: CreatePageDto, file: Express.Multer.File) {
    if (!isUUID(payload.bookId)) {
      throw new BadRequestException('BookId Error Format');
    }

    if (!file) throw new BadRequestException('Send an audio file');

    const foundBook = await this.prisma.book.findUnique({
      where: { id: payload.bookId },
    });

    if (!foundBook) {
      throw new NotFoundException('Book not found');
    }

    const audioUrl = await this.audioUpload.fileUpload(file);

    const foundPage = await this.prisma.writeBookTypeng.findFirst({
      where: { book_id: payload.bookId, page_order: payload.page_order },
    });

    if (foundPage) {
      throw new BadRequestException('page_order already exists');
    }

    const newPage = await this.prisma.writeBookTypeng.create({
      data: {
        book_id: payload.bookId,
        page: payload.page,
        page_order: payload.page_order,
        audio_url: audioUrl,
      },
    });

    return {
      message: 'success ✅',
      data: newPage,
    };
  }

  async update(payload: UpdatePageDto, file: Express.Multer.File, id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('BookId Error Format');
    }

    const foundPage = await this.prisma.writeBookTypeng.findUnique({
      where: { id },
    });

    if (!foundPage) {
      throw new NotFoundException('page not found');
    }

    let audioUrl: any;

    if (file) {
      audioUrl = await this.audioUpload.fileUpload(file, foundPage.audio_url);
    }

    const data = await this.prisma.writeBookTypeng.update({
      where: { id },
      data: {
        page: payload.page || foundPage.page,
        audio_url: audioUrl || foundPage.audio_url,
      },
    });

    return {
      message: 'success ✅',
      data: data,
    };
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('BookId Error Format');
    }

    const foundPage = await this.prisma.writeBookTypeng.findUnique({
      where: { id },
    });

    if (!foundPage) {
      throw new NotFoundException('page not found');
    }

    await this.audioUpload.fileUpload(undefined, foundPage.audio_url);

    await this.prisma.writeBookTypeng.delete({ where: { id } });

    return {
      message: 'succcess ✅',
    };
  }

  async getByIdPage({ bookId }, req: Request & { userId: string }) {
    if (!isUUID(bookId)) {
      throw new BadRequestException('BookId Error Format');
    }

    const foundBook = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!foundBook) {
      throw new NotFoundException('book not found');
    }

    const userId = req.userId;

    const admin = await this.prisma.user.findFirst({
      where: { email: 'yuvsufn@gmail.com' },
    });

    let checkAdmin: boolean;

    if (userId == admin?.id) {
      checkAdmin = false;
    } else {
      checkAdmin = true;
    }

    const foundSavedPage = await this.prisma.savedPagWithUser.findFirst({
      where: { bookId: bookId, userId: userId },
    });

    if (!foundSavedPage) {
      const newSavedPage = await this.prisma.savedPagWithUser.create({
        data: {
          bookId: bookId,
          userId: userId,
        },
      });

      const foundPage = await this.prisma.writeBookTypeng.findFirst({
        where: {
          book_id: bookId,
          page_order: newSavedPage.saved_page_order,
        },
      });

      return {
        message: 'success ✅',
        data: foundPage,
        bookImg: foundBook.imgUrl,
        bookName: foundBook.name,
        admin: checkAdmin,
      };
    }

    const foundPage = await this.prisma.writeBookTypeng.findFirst({
      where: {
        book_id: bookId,
        page_order: foundSavedPage.saved_page_order,
      },
    });

    return {
      message: 'success',
      data: foundPage,
      bookImg: process.env.BACKEND_URL + foundBook.imgUrl,
      bookName: foundBook.name,
      admin: checkAdmin,
    };
  }

  async getNewPageToUser(
    { pageId, bookId },
    req: Request & { userId: string },
  ) {
    const userId = req.userId;

    if (!isUUID(bookId) || !isUUID(pageId) || !isUUID(userId)) {
      throw new BadRequestException('ID format error');
    }
    const userProgress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    await this.prisma.userProgress.update({
      where: { userId: userId },
      data: {
        score: (userProgress?.score || 0) + 100,
      },
    });

    const foundSavedPage = await this.prisma.savedPagWithUser.findFirst({
      where: {
        userId: userId,
        bookId: bookId,
      },
    });

    if (!foundSavedPage) {
      throw new NotFoundException('SavedPage Not Found');
    }

    const founPageOrder = await this.prisma.writeBookTypeng.findFirst({
      where: {
        book_id: bookId,
        page_order: foundSavedPage.saved_page_order + 1,
      },
    });

    const findBook = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!founPageOrder) {
      await this.prisma.savedPagWithUser.update({
        where: { id: foundSavedPage.id },
        data: {
          saved_page_order: 1,
        },
      });

      const findPage = await this.prisma.writeBookTypeng.findFirst({
        where: { book_id: bookId, page_order: 1 },
      });
      return {
        message: 'The pages have ended \n 🎉 🎉 👏 👏 👏 👏 👏 🎉 🎉',
        data: findPage,
        bookImg: (process.env.BACKEND_URL as string) + findBook?.imgUrl,
        bookName: findBook?.name,
      };
    }

    await this.prisma.savedPagWithUser.update({
      where: { id: foundSavedPage.id },
      data: {
        saved_page_order: founPageOrder.page_order,
      },
    });

    return {
      message: 'success ✅',
      data: founPageOrder,
      bookImg: (process.env.BACKEND_URL as string) + findBook?.imgUrl,
      bookName: findBook?.name,
    };
  }
}
