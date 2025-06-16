import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateQuizQuiestionDto {
  @ApiProperty({ type: 'string', example: 'question-text', required: false })
  @IsString()
  @MinLength(4)
  questionText: string;

  @ApiProperty({ type: 'string', example: 'correct-answer', required: false })
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
    required: false,
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
}
