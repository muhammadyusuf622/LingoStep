import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateBookDto {

  @ApiProperty({type: 'string', example: 'Harry Pottes', required: true})
  @IsString()
  name: string;

  @ApiProperty({type: 'string', format: 'binary', description: 'Yuklanadigan rasm'})
  @IsOptional()
  image?: any;
}
