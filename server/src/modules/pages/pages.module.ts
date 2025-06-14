import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { PrismaService } from 'src/prisma';
import { AudioFileUpload } from 'src/helpers';

@Module({
  controllers: [PagesController],
  providers: [PagesService, PrismaService, AudioFileUpload],
})
export class PagesModule {}
