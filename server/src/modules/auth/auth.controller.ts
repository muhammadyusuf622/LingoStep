import { Controller, Get, Post, Body, UseGuards, Req, Res, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UpdateUsernameDto } from './dto';
import { Protected, Roles } from 'src/decaratores';
import { UserRoles } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get()
  @Protected(false)
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @Protected(false)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  create(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) res: Response) {
    return this.service.register(createAuthDto, res);
  }

  @Get('/google')
  @Protected(false)
  @UseGuards(AuthGuard('google'))
  async google() {}

  @Get('/google/callback')
  @Protected(false)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return await this.service.registerGoogle(req.user, res);
  }

  @Get('/facebook')
  @Protected(false)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseGuards(AuthGuard('facebook'))
  async facebook() {}

  @Get('/facebook/callback')
  @Protected(false)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseGuards(AuthGuard('facebook'))
  async facebookCAllback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return await this.service.registerFacebook(req.user, res);
  }

  @Get('github/callback')
  @Protected(false)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: any, @Res({ passthrough: true }) res: Response){
    return await this.service.registerGithub(req.user.email, res)
  }

  @Post('/updateUsername')
  @Protected(true)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async updateUsername(@Body() payload: UpdateUsernameDto, @Req() req: any){
    return await this.service.updateUsername(payload, req)
  }  

  @Post('/login')
  @Protected(true)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async login(@Body() payload: CreateAuthDto, @Res({ passthrough: true }) res: Response) {
    return await this.service.login(payload, res)
  }

  @Get('/checkToken')
  @Protected(true)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async checkToken(){
    return {message: "ok"}
  }

  @Get('/getUserById')
  @Protected(true)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async getUser(@Req() req: Request){
    return await this.service.getUser(req)
  }

  @Post('/changeImg')
  @UseInterceptors(FileInterceptor('avatar', {
      limits: {fileSize: 1 * 1024 * 1024},
      fileFilter: (req, file, cb) => {
        if(!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)){
          return cb(new BadRequestException('Only image files can be uploaded!'), false);
        }
        cb(null, true)
      } 
  }))
  @Protected(true)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async changeImg(@UploadedFile() image: Express.Multer.File, @Req() req: Request){
    return await this.service.changeImg(image, req)
  }

  @Get('locaut')
  @Protected(true)
  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPPER_ADMIN])
  async locaut(@Res({ passthrough: true }) res: Response){
    return await this.service.locaut(res)
  }
}
