import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Protected, Roles } from 'src/decaratores';
import { UserRoles } from '@prisma/client';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  findAll() {
    return this.quizService.findAll();
  }

  @Post()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|avif)$/)) {
          return cb(
            new BadRequestException('Only image files can be uploaded!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createQuizDto: CreateQuizDto,
  ) {
    return this.quizService.create(createQuizDto, file);
  }

  @Patch(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|avif)$/)) {
          return cb(
            new BadRequestException('Only image files can be uploaded!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  update(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(id, updateQuizDto, file);
  }

  @Delete(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  remove(@Param('id') id: string) {
    return this.quizService.remove(id);
  }
}
