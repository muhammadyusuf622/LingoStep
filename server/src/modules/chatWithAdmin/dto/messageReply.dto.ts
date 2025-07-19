import { ApiProperty } from "@nestjs/swagger";
import { Complaint } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";


export class ReplyMessageDto{

  @ApiProperty({type: 'string', example: 'row id', required: true})
  @IsString()
  rowId: string;

  @ApiProperty({type: 'string', example: 'reply message', required: false})
  @Transform(({value}) => value.trim())
  @IsOptional()
  @IsString()
  @MinLength(4)
  adminMessage: string;

  @ApiProperty({type: 'string', example: Complaint.resolved, required: true, enum: Complaint})
  @IsEnum(Complaint, { message: 'status must be one of: pending, resolved, rejected' })
  @IsString()
  status: Complaint;
}