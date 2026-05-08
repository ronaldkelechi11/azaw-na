import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty({ description: 'The public slug of the recipient user' })
  @IsString()
  @IsNotEmpty()
  recipientSlug: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  message?: string;
}
