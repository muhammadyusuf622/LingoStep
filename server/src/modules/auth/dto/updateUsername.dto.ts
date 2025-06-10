import { IsString, MinLength } from "class-validator";


export class UpdateUsernameDto{

  @IsString()
  @MinLength(4)
  username: string;
}