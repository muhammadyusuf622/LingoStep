import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateQuizDto {

  @ApiProperty({type: 'string', example: 'Quiz Name', required: true})
  @IsString()
  title: string;

  @ApiProperty({type: 'number', example: 1, required: true})
  @Transform(({value}) => Number(value))
  @IsInt()
  @IsPositive()
  level: number;

  @ApiProperty({type: 'string', format: 'binary', description: 'imgaes', required: true})
  @IsOptional()
  image: any;
}
