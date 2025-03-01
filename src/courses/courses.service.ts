import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CourseLevel, CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo khóa học mới
  async createCourse(data: CreateCourseDto & { ownerId: string }) {
    return this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        isPublished: data.isPublished || false,
        ownerId: data.ownerId,
        price: data.price || 0.0,
        currency: data.currency || 'VND',
        level: data.level as CourseLevel,
        tags: data.tags || [],
        thumbnailUrl: data.thumbnailUrl,
      },
    });
  }
  async getCourseStructureById(courseId: string) {
    return this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        chapters: {
          select: {
            id: true,
            title: true,
            lessons: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  }
  async getCourseStructureByUserId(ownerId: string) {
    return this.prisma.course.findMany({
      where: { ownerId: ownerId },
      select: {
        id: true,
        ownerId: true,
        title: true,
        chapters: {
          select: {
            id: true,
            title: true,
            lessons: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  }
  // Lấy danh sách khóa học với bộ lọc & phân trang
  async findAll(
    filters: {
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      level?: CourseLevel;
      createdAt?: Date;
      tags?: string[];
    },
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    return this.prisma.course.findMany({
      where: {
        categoryId: filters.categoryId,
        price: {
          gte: filters.minPrice,
          lte: filters.maxPrice,
        },
        level: filters.level,
        createdAt: filters.createdAt,
        tags: filters.tags ? { hasSome: filters.tags } : undefined, // Lọc theo tags
      },
      skip,
      take: limit,
      include: {
        category: true,
      },
    });
  }
  async findByCategoryId(categoryId: string) {
    return this.prisma.course.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
    });
  }
  async findAllStructure(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    return this.prisma.course.findMany({
      skip,
      take: limit,
      include: {
        category: true,
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }

  // Lấy chi tiết khóa học theo ID
  async findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }

  // Cập nhật khóa học
  async updateCourse(id: string, data: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  // Xóa khóa học
  async deleteCourse(id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }

  // Publish khóa học
  async publishCourse(id: string) {
    return this.prisma.course.update({
      where: { id },
      data: { isPublished: true },
    });
  }

  // Unpublish khóa học
  async unpublishCourse(id: string) {
    return this.prisma.course.update({
      where: { id },
      data: { isPublished: false },
    });
  }
}
