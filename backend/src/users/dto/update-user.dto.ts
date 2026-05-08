import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  socialLinks?: Record<string, string>;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  settings?: Record<string, boolean>;
}
