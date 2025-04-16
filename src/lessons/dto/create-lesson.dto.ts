import { LessonType } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  content?: string;
  @IsOptional()
  @IsEnum(LessonType)
  type?: LessonType;
  @IsOptional()
  @IsUrl()
  videoUrl?: string;
  @IsOptional()
  @IsString()
  chapterId?: string;
  @IsOptional()
  @IsInt()
  duration?: number;
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isFreePreview?: boolean;
}
