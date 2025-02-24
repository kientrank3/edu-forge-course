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
    const lastChapter = await this.prisma.chapter.findFirst({
      where: { courseId: createChapterDto.courseId },
      orderBy: { order: 'desc' }, // Sắp xếp theo order giảm dần để lấy chapter cuối cùng
    });
    const newOrder = lastChapter ? lastChapter.order + 1 : 1;
    // Tạo chapter mới
    return this.prisma.chapter.create({
      data: {
        title: createChapterDto.title,
        description: createChapterDto.description,
        courseId: createChapterDto.courseId,
        order: createChapterDto.order ?? newOrder, // Sử dụng order từ DTO nếu có, ngược lại dùng newOrder
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
