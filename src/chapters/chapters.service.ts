import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  async create(createChapterDto: CreateChapterDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: createChapterDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.chapter.create({
      data: {
        title: createChapterDto.title,
        description: createChapterDto.description,
        courseId: createChapterDto.courseId,
        order: createChapterDto.order ?? 0,
        isPublished: createChapterDto.isPublished ?? false,
      },
      include: {
        lessons: true,
      },
    });
  }

  async findByCourse(courseId: string) {
    const chapters = await this.prisma.chapter.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    if (chapters.length === 0) {
      throw new NotFoundException('No chapters found for this course');
    }

    return chapters;
  }

  async findAll() {
    return this.prisma.chapter.findMany({
      include: {
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
        course: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
        course: true,
      },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter;
  }

  async update(id: string, updateChapterDto: UpdateChapterDto) {
    return this.prisma.chapter.update({
      where: { id },
      data: updateChapterDto,
    });
  }

  async remove(id: string) {
    return this.prisma.chapter.delete({
      where: { id },
    });
  }
}
