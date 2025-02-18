import { IsString, IsOptional, IsNumber, IsEnum, IsUrl } from 'class-validator';

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  isPublished?: boolean;
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  tags?: string[];
}
