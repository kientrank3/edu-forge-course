import { IsUUID, IsNumber, IsBoolean } from 'class-validator';

export class UserProgressDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsUUID()
  lessonId: string;

  @IsBoolean()
  isCompleted: boolean;

  @IsNumber()
  progress: number;
}
