export class CreateChapterDto {
  title: string;
  description?: string;
  order?: number;
  courseId: string;
  isPublished?: boolean;
}
