import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizQuiestionDto } from './dto/create-quiz-quiestion.dto';
import { UpdateQuizQuiestionDto } from './dto/update-quiz-quiestion.dto';
import { PrismaService } from 'src/prisma';
import { isUUID } from 'validator';
import { AudioFileUpload, FileUpload, VideoFileUpload } from 'src/helpers';

@Injectable()
export class QuizQuiestionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imgFile: FileUpload,
    private readonly audioFile: AudioFileUpload,
    private readonly videoFile: VideoFileUpload,
  ) {}

  async findAll() {
    const data = await this.prisma.quizQuestion.findMany();

    return {
      message: 'success',
      data: data,
    };
  }

  async create(payload: CreateQuizQuiestionDto, files: any) {
    if (!isUUID(payload.quizId)) {
      throw new BadRequestException('ID Error Format');
    }

    const foundQuiz = await this.prisma.quiz.findUnique({
      where: { id: payload.quizId },
    });

    if (!foundQuiz) {
      throw new NotFoundException('Quiz Not Found');
    }

    const hasImage = !!files?.image?.[0];
    const hasAudio = !!files?.audio?.[0];
    const hasVideo = !!files?.video?.[0];

    const totalUploaded = [hasImage, hasAudio, hasVideo].filter(Boolean).length;

    if (totalUploaded === 0) {
      throw new BadRequestException(
        'At least one file (image, audio, or video) is required',
      );
    }

    if (totalUploaded > 1) {
      throw new BadRequestException(
        'Only one of image, audio, or video must be uploaded',
      );
    }

    let imgUrl: any;
    let audioUrl: any;
    let videoUrl: any;

    if (hasAudio) {
      audioUrl = await this.audioFile.fileUpload(files?.audio?.[0]);
    } else if (hasImage) {
      imgUrl = await this.imgFile.fileUpload(files?.image?.[0]);
    } else if (hasVideo) {
      videoUrl = await this.videoFile.fileUpload(files?.video?.[0]);
    }

    const foundPageOrder = await this.prisma.quizQuestion.findFirst({
      where: { quiz_id: payload.quizId, page_order: payload.page_order },
    });

    if (foundPageOrder) {
      throw new BadRequestException('page order is already used');
    }

    const data = await this.prisma.quizQuestion.create({
      data: {
        question_text: payload.questionText,
        correct_answer: payload.correctAnswer,
        quiz_id: payload.quizId,
        page_order: payload.page_order,
        img_url: imgUrl,
        video_url: videoUrl,
        audio_url: audioUrl,
        quizOptions: payload.quizOptions,
      },
    });

    return {
      message: 'success',
      data: data,
    };
  }

  async update(id: string, payload: UpdateQuizQuiestionDto, files: any) {
    if (!isUUID(id)) {
      throw new BadRequestException('ID Error Format');
    }

    const foundQuizQuestion = await this.prisma.quizQuestion.findUnique({
      where: { id },
    });

    if (!foundQuizQuestion) {
      throw new NotFoundException('Quiz Question page not found');
    }

    const hasImage = !!files?.image?.[0];
    const hasAudio = !!files?.audio?.[0];
    const hasVideo = !!files?.video?.[0];

    const totalUploaded = [hasImage, hasAudio, hasVideo].filter(Boolean).length;

    if (totalUploaded === 0) {
      throw new BadRequestException(
        'At least one file (image, audio, or video) is required',
      );
    }

    if (totalUploaded > 1) {
      throw new BadRequestException(
        'Only one of image, audio, or video must be uploaded',
      );
    }

    let imgUrl: any;
    let audioUrl: any;
    let videoUrl: any;

    if (hasAudio) {
      audioUrl = await this.audioFile.fileUpload(files?.audio?.[0]);
    } else if (hasImage) {
      imgUrl = await this.imgFile.fileUpload(files?.image?.[0]);
    } else if (hasVideo) {
      videoUrl = await this.videoFile.fileUpload(files?.video?.[0]);
    }

    if (foundQuizQuestion.audio_url) {
      await this.audioFile.fileUpload(undefined, foundQuizQuestion.audio_url);
    } else if (foundQuizQuestion.img_url) {
      await this.imgFile.fileUpload(undefined, foundQuizQuestion.img_url);
    } else if (foundQuizQuestion.video_url) {
      await this.videoFile.fileUpload(undefined, foundQuizQuestion.video_url);
    }

    const data = await this.prisma.quizQuestion.update({
      where: { id },
      data: {
        question_text: payload.questionText || foundQuizQuestion.question_text,
        correct_answer:
          payload.correctAnswer || foundQuizQuestion.correct_answer,
        img_url: imgUrl || null,
        audio_url: audioUrl || null,
        video_url: videoUrl || null,
        quizOptions: payload.quizOptions || foundQuizQuestion.quizOptions,
      },
    });

    return {
      message: 'success',
      data: data,
    };
  }

  async getByQuizId({ quizId }: any) {
    if (!isUUID(quizId)) {
      throw new BadRequestException('Id Error Format');
    }

    const foundQuiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!foundQuiz) {
      throw new NotFoundException('Quiz Not Found');
    }

    const foundQuestion = await this.prisma.quizQuestion.findFirst({
      where: { quiz_id: quizId, page_order: 1 },
    });

    if (!foundQuestion) {
      throw new NotFoundException('Question page Not Found');
    }

    if (foundQuestion.img_url) {
      foundQuestion.img_url =
        (process.env.BACKEND_URL as string) + foundQuestion.img_url;
    } else if (foundQuestion.video_url) {
      foundQuestion.video_url =
        (process.env.BACKEND_URL as string) + foundQuestion.video_url;
    } else if (foundQuestion.audio_url) {
      foundQuestion.audio_url =
        (process.env.BACKEND_URL as string) + foundQuestion.audio_url;
    }

    return {
      message: 'success',
      data: foundQuestion,
    };
  }

  async getNextQuestion({ quizId, pageOrder }: any) {
    if (!isUUID(quizId)) {
      throw new BadRequestException('Id Error Format');
    }

    const foundQuiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!foundQuiz) {
      throw new NotFoundException('Next Question Not Found');
    }

    const foundQuestion = await this.prisma.quizQuestion.findFirst({
      where: { quiz_id: quizId, page_order: pageOrder + 1 },
    });

    if(!foundQuestion){
      return {message: "over"}
    }
    
    if (foundQuestion.img_url) {
      foundQuestion.img_url = (process.env.BACKEND_URL as string) + foundQuestion.img_url;
    } else if (foundQuestion.video_url) {
      foundQuestion.video_url = (process.env.BACKEND_URL as string) + foundQuestion.video_url;
    } else if (foundQuestion.audio_url) {
      foundQuestion.audio_url = (process.env.BACKEND_URL as string) + foundQuestion.audio_url;
    }

    return {
      message: 'success',
      data: foundQuestion
    };
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('ID Error Format');
    }

    const foundQuizQuestion = await this.prisma.quizQuestion.findUnique({
      where: { id },
    });

    if (!foundQuizQuestion) {
      throw new NotFoundException('Quiz Question page not found');
    }

    if (foundQuizQuestion.audio_url) {
      await this.audioFile.fileUpload(undefined, foundQuizQuestion.audio_url);
    } else if (foundQuizQuestion.img_url) {
      await this.imgFile.fileUpload(undefined, foundQuizQuestion.img_url);
    } else if (foundQuizQuestion.video_url) {
      await this.videoFile.fileUpload(undefined, foundQuizQuestion.video_url);
    }

    await this.prisma.quizQuestion.delete({ where: { id } });

    return {
      message: 'success',
    };
  }
}
