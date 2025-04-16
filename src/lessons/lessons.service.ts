import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  // src/lessons/lessons.service.ts
  async create(
    courseId: string,
    chapterId: string,
    createLessonDto: CreateLessonDto,
  ) {
    // Kiểm tra chapter có tồn tại và thuộc course không
    const chapter = await this.prisma.chapter.findFirst({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });
    if (!chapter) {
      throw new NotFoundException(
        'Chapter not found or does not belong to the specified course',
      );
    }

    // Lấy lesson cuối cùng trong chapter để xác định giá trị order
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { chapterId },
      orderBy: { order: 'desc' }, // Sắp xếp theo order giảm dần để lấy lesson cuối cùng
    });

    // Nếu không có lesson nào, order mặc định là 1, ngược lại tăng order lên 1
    const newOrder = lastLesson ? lastLesson.order + 1 : 1;

    // Kiểm tra title có tồn tại không
    if (!createLessonDto || !createLessonDto.title) {
      throw new Error('Lesson title is required');
    }

    // Tạo lesson mới
    const lesson = await this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        content: createLessonDto.content,
        type: createLessonDto.type,
        videoUrl: createLessonDto.videoUrl,
        order: createLessonDto.order ?? newOrder, // Sử dụng order từ DTO nếu có, ngược lại dùng newOrder
        isPublished: createLessonDto.isPublished ?? false,
        isFreePreview: createLessonDto.isFreePreview ?? false,
        chapterId,
      },
      include: {
        chapter: true,
      },
    });

    // Cập nhật totalLessons của khóa học
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        totalLessons: {
          increment: 1,
        },
      },
    });

    return lesson;
  }

  async findAllByChapterId(chapterId: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter.lessons;
  }

  async findOne(courseId: string, chapterId: string, id: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        chapter: {
          id: chapterId,
          courseId: courseId,
        },
      },
      include: {
        chapter: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    await this.findOneById(id); // Kiểm tra lesson tồn tại
    return this.prisma.lesson.update({
      where: { id },
      data: {
        ...updateLessonDto,
        chapterId: undefined,
      },
    });
  }
  async findOneById(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async remove(id: string) {
    await this.findOneById(id);
    return this.prisma.lesson.delete({
      where: { id },
    });
  }

  async findAllByCourseId(courseId: string) {
    const chapters = await this.prisma.chapter.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    if (chapters.length === 0) {
      throw new NotFoundException('No chapters found for this course');
    }

    const lessons = chapters.flatMap((chapter) => chapter.lessons);
    const totalVideos = lessons.filter(
      (lesson) => lesson.type === 'VIDEO',
    ).length;

    return {
      chapters,
      totalLessons: lessons.length,
      totalVideos,
    };
  }
}
