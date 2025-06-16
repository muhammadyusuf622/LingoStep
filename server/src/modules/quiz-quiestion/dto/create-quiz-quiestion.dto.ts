import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateQuizQuiestionDto {
  @ApiProperty({ type: 'string', example: 'question-text', required: true })
  @IsString()
  @MinLength(4)
  questionText: string;

  @ApiProperty({ type: 'string', example: 'correct-answer', required: true })
  @IsString()
  @MinLength(4)
  correctAnswer: string;

  @ApiProperty({
    type: Object,
    example: {
      A: 'Tashkent',
      B: 'Samarkand',
      C: 'Bukhara',
      D: 'Khiva',
    },
    description: 'Quiz options as key-value pairs with additional info',
    required: true
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  quizOptions: object;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Video',
    required: false,
  })
  @IsOptional()
  @IsString()
  video: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Images',
    required: false,
  })
  @IsOptional()
  @IsString()
  image: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio',
    required: false,
  })
  @IsOptional()
  @IsString()
  audio: any;

  @ApiProperty({ type: 'number', example: 1, required: true })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  page_order: number;

  @ApiProperty({ type: 'string', example: 'Quiz-Id', required: true })
  @IsString()
  quizId: string;
}
