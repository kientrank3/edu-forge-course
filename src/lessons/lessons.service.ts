import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        content: createLessonDto.content,
        type: createLessonDto.type,
        videoUrl: createLessonDto.videoUrl,
        order: createLessonDto.order ?? 0,
        isPublished: createLessonDto.isPublished ?? false,
        isFreePreview: createLessonDto.isFreePreview ?? false,
        chapterId,
      },
      include: {
        chapter: true,
      },
    });
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

  async update(
    courseId: string,
    chapterId: string,
    id: string,
    updateLessonDto: UpdateLessonDto,
  ) {
    await this.findOne(courseId, chapterId, id);

    return this.prisma.lesson.update({
      where: { id },
      data: {
        ...updateLessonDto,
        chapterId: undefined,
      },
    });
  }

  async remove(courseId: string, chapterId: string, id: string) {
    await this.findOne(courseId, chapterId, id); // Kiểm tra bài học tồn tại

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
