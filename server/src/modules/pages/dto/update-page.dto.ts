import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdatePageDto {

  @ApiProperty({type: 'string', example: 'Book page', required: false})
  @IsOptional()
  @IsString()
  page: string

  @ApiProperty({type: 'string', format: 'binary', description: 'audio yuklang', required: false})
  @IsOptional()
  audio: string;
}
