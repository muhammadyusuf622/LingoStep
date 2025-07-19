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
  UploadedFiles,
} from '@nestjs/common';
import { QuizQuiestionService } from './quiz-quiestion.service';
import { CreateQuizQuiestionDto } from './dto/create-quiz-quiestion.dto';
import { UpdateQuizQuiestionDto } from './dto/update-quiz-quiestion.dto';
import { Protected, Roles } from 'src/decaratores';
import { UserRoles } from '@prisma/client';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('quiz-quiestion')
export class QuizQuiestionController {
  constructor(private readonly quizQuiestionService: QuizQuiestionService) {}

  @Get()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  findAll() {
    return this.quizQuiestionService.findAll();
  }

  @Post()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      {
        limits: { fileSize: 100 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
          const mime = file.mimetype;
          const fieldName = file.fieldname;

          const isValidImage =
            fieldName === 'image' &&
            ['image/jpeg', 'image/png', 'image/avif', 'image/webp'].includes(mime);
          const isValidAudio =
            fieldName === 'audio' &&
            ['audio/mpeg', 'audio/mp3', 'audio/wav'].includes(mime);
          const isValidVideo =
            fieldName === 'video' &&
            ['video/mp4', 'video/webm', 'video/ogg'].includes(mime);

          if (isValidImage || isValidAudio || isValidVideo) {
            cb(null, true);
          } else {
            cb(
              new BadRequestException(
                `Invalid file type for field ${fieldName}`,
              ),
              false,
            );
          }
        },
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createQuizQuiestionDto: CreateQuizQuiestionDto,
  ) {
    return this.quizQuiestionService.create(createQuizQuiestionDto, files);
  }

  @Patch(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      {
        limits: { fileSize: 100 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
          const mime = file.mimetype;
          const fieldName = file.fieldname;

          const isValidImage =
            fieldName === 'image' &&
            ['image/jpeg', 'image/png', 'image/avif'].includes(mime);
          const isValidAudio =
            fieldName === 'audio' &&
            ['audio/mpeg', 'audio/mp3', 'audio/wav'].includes(mime);
          const isValidVideo =
            fieldName === 'video' &&
            ['video/mp4', 'video/webm', 'video/ogg'].includes(mime);

          if (isValidImage || isValidAudio || isValidVideo) {
            cb(null, true);
          } else {
            cb(
              new BadRequestException(
                `Invalid file type for field ${fieldName}`,
              ),
              false,
            );
          }
        },
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id') id: string,
    @Body() updateQuizQuiestionDto: UpdateQuizQuiestionDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.quizQuiestionService.update(id, updateQuizQuiestionDto, files);
  }

  @Post('/getByQuizId')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  async getByQuizId(@Body() body: any){
    return await this.quizQuiestionService.getByQuizId(body);
  }

  @Post('/nextPage')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  async getNextQuestion(@Body() body: any){
    return await this.quizQuiestionService.getNextQuestion(body)
  }

  @Delete(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  remove(@Param('id') id: string) {
    return this.quizQuiestionService.remove(id);
  }
}
