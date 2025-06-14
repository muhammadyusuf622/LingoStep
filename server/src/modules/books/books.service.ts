import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { PrismaService } from 'src/prisma';
import { FileUpload } from 'src/helpers';
import { isUUID } from 'validator';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUpload: FileUpload,
  ) {}

  async findAll() {
    const data = await this.prisma.book.findMany();

    const newData = data.map((item) => {
      item.imgUrl = (process.env.BACKEND_URL as string) + item.imgUrl
      return item;
    });
    return {
      message: 'success',
      data: newData,
    };
  }

  async create(createBookDto: CreateBookDto, file: Express.Multer.File) {
    const imgUrl = await this.fileUpload.fileUpload(file);

    const data = await this.prisma.book.create({
      data: { name: createBookDto.name, imgUrl: imgUrl as string },
    });

    return {
      message: 'success ✅',
      data: data,
    };
  }

  async updateBook(
    payload: UpdateBookDto,
    file: Express.Multer.File,
    id: string,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('ID Error Format');
    }

    const foundBook = await this.prisma.book.findUnique({ where: { id } });

    if (!foundBook) {
      throw new NotFoundException('Book Not Found');
    }
    let imgUrl: any;

    if (file) {
      imgUrl = await this.fileUpload.fileUpload(file, foundBook.imgUrl);
    }

    const newData = await this.prisma.book.update({
      where: { id },
      data: { name: payload.name, imgUrl: imgUrl || foundBook.imgUrl },
    });

    return {
      message: 'success ✅',
      data: newData,
    };
  }

  async deleteBook(id: string){

    if (!isUUID(id)) {
      throw new BadRequestException('ID Error Format');
    }

    const foundBook = await this.prisma.book.findUnique({ where: { id } });

    if (!foundBook) {
      throw new NotFoundException('Book Not Found');
    }

    await this.fileUpload.fileUpload(undefined, foundBook.imgUrl)

    await this.prisma.book.delete({where: {id}});

    return {
      message: "success ✅"
    }
  }
}
