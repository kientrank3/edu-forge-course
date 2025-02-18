import { LessonType } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  content?: string;
  type?: LessonType;
  @IsOptional()
  @IsUrl()
  videoUrl?: string;
  chapterId: number;
  @IsOptional()
  @IsInt()
  duration?: number;
  isPublished?: boolean;
  @IsInt()
  order: number;
  isFreePreview?: boolean;
}
