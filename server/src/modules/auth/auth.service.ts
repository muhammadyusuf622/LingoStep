import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma';
import { networks } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { RegisterWithDto, UpdateUsernameDto } from './dto';
import { IntRegtsterFacebook } from './interface';
import { FileUpload, JwtHelper } from 'src/helpers';
import { Request, Response } from 'express';
import { isUUID } from 'validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtHelper,
    private readonly fileUpload: FileUpload,
  ) {}

  async findAll() {
    const data = await this.prisma.user.findMany();
    return data;
  }

  async register(payload: CreateAuthDto, res: Response) {
    const foundUser = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (foundUser) {
      return { message: 'user already exists please change your email' };
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);

    const data = await this.prisma.user.create({
      data: {
        email: payload.email,
        password: hashPassword,
        type: networks.normal,
      },
    });

    const tokenPayload = {
      id: data.id,
      role: data.role,
    };

    const token = await this.jwt.generateToken(tokenPayload);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      message: 'success',
      data: data,
    };
  }

  async registerGoogle(payload: RegisterWithDto, res: any) {
    const foundUser = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    let data: any;

    if (!foundUser) {
      data = await this.prisma.user.create({
        data: { email: payload.email, type: networks.github },
      });
    } else {
      data = foundUser;
    }

    const tokenPayload = {
      id: data.id,
      role: data.role,
    };

    const token = await this.jwt.generateToken(tokenPayload);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    if (isUUID(data.username)) {
      res.redirect(`${process.env.CORS_ORIGINS}/pages/createUsername.html`);
    } else {
      res.redirect(`${process.env.CORS_ORIGINS}/pages/homePage.html`);
    }
  }

  async registerFacebook(payload: IntRegtsterFacebook, res: any) {
    const foundUser = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    let data: any;

    if (!foundUser) {
      data = await this.prisma.user.create({
        data: { email: payload.email, type: networks.github },
      });
    } else {
      data = foundUser;
    }

    const tokenPayload = {
      id: data.id,
      role: data.role,
    };

    const token = await this.jwt.generateToken(tokenPayload);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    if (isUUID(data.username)) {
      res.redirect(`${process.env.CORS_ORIGINS}/pages/createUsername.html`);
    } else {
      res.redirect(`${process.env.CORS_ORIGINS}/pages/homePage.html`);
    }
  }

  async registerGithub(email: string, res: any) {
    const foundUser = await this.prisma.user.findFirst({
      where: { email },
    });

    let data: any;

    if (!foundUser) {
      data = await this.prisma.user.create({
        data: { email: email, type: networks.github },
      });
    } else {
      data = foundUser;
    }

    const tokenPayload = {
      id: data.id,
      role: data.role,
    };

    const token = await this.jwt.generateToken(tokenPayload);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    if (isUUID(data.username)) {
      res.redirect(`${process.env.CORS_ORIGINS}/pages/createUsername.html`);
    } else {
      res.redirect(`${process.env.CORS_ORIGINS}/pages/homePage.html`);
    }
  }

  async updateUsername(payload: UpdateUsernameDto, req: any) {
    if (!isUUID(req.userId)) {
      throw new BadRequestException('Invalid UUID');
    }

    const foundUser = await this.prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const foundUsername = await this.prisma.user.findFirst({
      where: { username: payload.username },
    });

    if (foundUsername) {
      return { message: 'username already exists please change username ' };
    }

    await this.prisma.user.update({
      where: { id: req.userId },
      data: {
        username: payload.username,
      },
    });

    return {
      message: 'success',
    };
  }

  async login(payload: CreateAuthDto, res: Response) {
    const foundUser = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (!foundUser) {
      return { message: 'Email or Password error please try again' };
    }

    if (!foundUser.password) {
      return { message: 'Email or Password error please try again' };
    }

    const openPassword = await bcrypt.compare(
      payload.password,
      foundUser.password,
    );

    if (!openPassword) {
      return { message: 'Email or Password error please try again' };
    }

    const tokenPayload = {
      id: foundUser.id,
      role: foundUser.role,
    };

    const token = await this.jwt.generateToken(tokenPayload);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { message: 'success' };
  }

  async getUser(req: any) {
    if (!isUUID(req?.userId)) {
      throw new BadRequestException('Id Error Format');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: req?.userId },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (
      user.imgUrl != 'https://cdn-icons-png.freepik.com/256/18238/18238419.png'
    ) {
      user.imgUrl = (process.env.BACKEND_URL as string) + user.imgUrl;
    }

    return {
      message: 'success',
      data: user,
    };
  }

  async changeImg(img: any, req: any) {
    const id = req.userId;

    if (!isUUID(id)) {
      throw new BadRequestException('Id Error Format');
    }

    const foundUser = await this.prisma.user.findUnique({ where: { id } });

    if (!foundUser) {
      throw new NotFoundException('User Not Found');
    }

    let newImgUrl: any;

    if (
      foundUser.imgUrl !=
      'https://cdn-icons-png.freepik.com/256/18238/18238419.png'
    ) {
      newImgUrl = await this.fileUpload.fileUpload(img, foundUser.imgUrl);
    } else {
      newImgUrl = await this.fileUpload.fileUpload(img);
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        imgUrl: newImgUrl,
      },
    });

    return {
      message: 'success',
    };
  }

  async locaut(res: Response) {

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      message: 'success',
    };
  }
}
