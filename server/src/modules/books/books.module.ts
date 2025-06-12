import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from 'src/prisma';
import { FileUpload } from 'src/helpers';

@Module({
  controllers: [BooksController],
  providers: [BooksService, PrismaService, FileUpload],
})
export class BooksModule {}
