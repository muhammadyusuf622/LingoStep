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
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Protected, Roles } from 'src/decaratores';
import { UserRoles } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  findAll() {
    return this.booksService.findAll();
  }

  @Post()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|avif)$/)) {
          return cb( new BadRequestException('Only image files can be uploaded!'),false,);
        }
        cb(null, true)
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  create(@UploadedFile() file: Express.Multer.File ,@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto, file);
  }

  @Patch(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|avif)$/)) {
          return cb( new BadRequestException('Only image files can be uploaded!'),false,);
        }
        cb(null, true)
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async updateBook(@UploadedFile() file: Express.Multer.File ,@Body() body: UpdateBookDto, @Param('id') id: string){
    return await this.booksService.updateBook(body, file, id)
  }

  @Delete(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async deleteBook(@Param('id') id: string){
    return await this.booksService.deleteBook(id)
  }
}
