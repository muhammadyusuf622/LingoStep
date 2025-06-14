import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuizDto } from './create-quiz.dto';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateQuizDto extends PartialType(CreateQuizDto) {

  @ApiProperty({ type: 'string', example: 'Quiz Name', required: false })
  @IsString()
  title: string;

  @ApiProperty({ type: 'number', example: 1, required: false })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  level: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'imgaes',
    required: false,
  })
  @IsOptional()
  image: any;
}
