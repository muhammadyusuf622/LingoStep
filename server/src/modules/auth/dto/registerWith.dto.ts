import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";



export class RegisterWithDto{

  @IsString()
  @IsEmail()
  email: string;
}