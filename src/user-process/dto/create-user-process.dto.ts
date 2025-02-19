import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateUserProgressDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsUUID()
  lessonId: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean = false;

  @IsNumber()
  @Min(0)
  @Max(1)
  progress: number;
}
