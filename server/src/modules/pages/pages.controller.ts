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
  Req,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Protected, Roles } from 'src/decaratores';
import { UserRoles } from '@prisma/client';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  findAll() {
    return this.pagesService.findAll();
  }

  @Post()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseInterceptors(
    FileInterceptor('audio', {
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^audio\/(mp3|mpeg|wav)$/)) {
          return cb(
            new BadRequestException('Only audio files can be uploaded!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  create(@UploadedFile() file: Express.Multer.File ,@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto, file);
  }


  @Patch(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseInterceptors(
    FileInterceptor('audio', {
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^audio\/(mp3|mpeg|wav)$/)) {
          return cb(
            new BadRequestException('Only audio files can be uploaded!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  update(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() body: UpdatePageDto) {
    return this.pagesService.update(body, file, id);
  }


  @Delete(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }

  @Post("/getByPageWithBookId")
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  async getById(@Body() body: any, @Req() req:Request & {userId: string}){
    return await this.pagesService.getByIdPage(body, req)
  }

  @Post('/getNewPage')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.SUPPER_ADMIN, UserRoles.USER])
  async getNewPageToUser(@Body() body: any, @Req() req:Request & {userId: string}){
    return await this.pagesService.getNewPageToUser(body, req);
  }
}
