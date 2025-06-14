import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class CreatePageDto {

  @ApiProperty({type: 'string', example: 'UUID', required: true})
  @IsString()
  bookId: string;

  @ApiProperty({type: 'string', example: 'Book page', required: true})
  @IsString()
  page: string

  @ApiProperty({type: 'number', example: 1, required: true})
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  page_order: number;

  @ApiProperty({type: 'string', format: 'binary', description: 'audio yuklang'})
  @IsOptional()
  audio: string;
}
