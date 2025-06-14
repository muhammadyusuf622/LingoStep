import { Module } from '@nestjs/common';
import { QuizQuiestionService } from './quiz-quiestion.service';
import { QuizQuiestionController } from './quiz-quiestion.controller';
import { PrismaService } from 'src/prisma';
import { AudioFileUpload, FileUpload, VideoFileUpload } from 'src/helpers';

@Module({
  controllers: [QuizQuiestionController],
  providers: [
    QuizQuiestionService,
    PrismaService,
    FileUpload,
    AudioFileUpload,
    VideoFileUpload,
  ],
})
export class QuizQuiestionModule {}
