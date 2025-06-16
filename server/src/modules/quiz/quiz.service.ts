import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'src/prisma';
import { FileUpload } from 'src/helpers';
import { isUUID } from 'validator';

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUpload: FileUpload,
  ) {}

  async findAll() {
    const data = await this.prisma.quiz.findMany();

    const newData = data.map((item) => {
      item.imgUrl = process.env.BACKEND_URL as string + item.imgUrl;
      return item
    })
    return {
      message: 'success',
      data: newData,
    };
  }

  async create(payload: CreateQuizDto, file: Express.Multer.File) {
    const imgUrl = await this.fileUpload.fileUpload(file);

    const quiz = await this.prisma.quiz.create({
      data: {
        title: payload.title,
        level: payload.level,
        imgUrl: imgUrl as string,
      },
    });

    return {
      message: 'success',
      data: quiz,
    };
  }

  async update(id: string, payload: UpdateQuizDto, file: Express.Multer.File) {
    if (!isUUID(id)) {
      throw new BadRequestException('ID Error Format');
    }

    const foundData = await this.prisma.quiz.findUnique({ where: { id } });

    if (!foundData) {
      throw new NotFoundException('Quiz Not Found');
    }
    let imgUrl: any;

    if (file) {
      imgUrl = await this.fileUpload.fileUpload(file, foundData.imgUrl);
    }

    const updateData = await this.prisma.quiz.update({
      where: { id },
      data: {
        title: payload.title || foundData.title,
        level: payload.level || foundData.level,
        imgUrl: imgUrl || foundData.imgUrl,
      },
    });

    return {
      message: 'success',
      data: updateData,
    };
  }

  async remove(id: string) {

    if (!isUUID(id)) {
      throw new BadRequestException('ID Error Format');
    }

    const foundData = await this.prisma.quiz.findUnique({ where: { id } });

    if (!foundData) {
      throw new NotFoundException('Quiz Not Found');
    }

    await this.fileUpload.fileUpload(undefined, foundData.imgUrl)

    await this.prisma.quiz.delete({where: {id}});

    return {
      message: 'success',
    };
  }
}
