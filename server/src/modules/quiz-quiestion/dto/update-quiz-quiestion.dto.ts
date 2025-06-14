import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateQuizQuiestionDto {

    @ApiProperty({type: 'string', example: 'question-text', required: false})
    @IsString()
    @MinLength(4)
    questionText: string;
  
    @ApiProperty({type: 'string', example: 'correct-answer', required: false})
    @IsString()
    @MinLength(4)
    correctAnswer: string;
  
    @ApiProperty({type: 'string', format: 'binary', description: 'Video' ,required: false})
    @IsOptional()
    @IsString()
    video: any;
  
    @ApiProperty({type: 'string', format: 'binary', description: 'Images' ,required: false})
    @IsOptional()
    @IsString()
    image: any;
  
    @ApiProperty({type: 'string', format: 'binary', description: 'Audio' ,required: false})
    @IsOptional()
    @IsString()
    audio: any;
}
