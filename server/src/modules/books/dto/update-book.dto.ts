import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateBookDto {

  @ApiProperty({type: 'string', example: 'Harry Potter', required: true})
  @IsString()
  name: string;

  @ApiProperty({type: 'string', format: 'binary', description: 'Yuklanadigan rasm', required: false})
  @IsOptional()
  image?: any;
}
