import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";


export class CreateAuthDto {

  @ApiProperty({type: 'string', example: 'yuvsufn@gmail.com', required: true})
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({type: 'string', example: 'salom', required: true})
  @IsString()
  @MinLength(4)
  password: string
}
