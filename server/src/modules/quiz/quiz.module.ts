import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaService } from 'src/prisma';
import { FileUpload } from 'src/helpers';

@Module({
  controllers: [QuizController],
  providers: [QuizService, PrismaService, FileUpload],
})
export class QuizModule {}
