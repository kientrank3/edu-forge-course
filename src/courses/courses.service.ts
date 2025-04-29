import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CourseLevel, CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo khóa học mới
  async createCourse(data: CreateCourseDto & { ownerId: string }) {
    // Kiểm tra title có tồn tại không
    if (!data || !data.title) {
      throw new Error('Course title is required');
    }

    // Kiểm tra categoryId có tồn tại không
    if (!data.categoryId) {
      throw new Error('Category ID is required');
    }

    // Kiểm tra ownerId có tồn tại không
    if (!data.ownerId) {
      throw new Error('Owner ID is required');
    }

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
        learningOutcomes: data.learningOutcomes || [],
        requirements: data.requirements || [],
        targetAudience: data.targetAudience,
        isHasCertificate: data.isHasCertificate || false,
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
      search?: string;
    },
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    // Build where conditions based on filters
    const where: {
      categoryId?: string;
      price?: { gte?: number; lte?: number };
      level?: CourseLevel;
      createdAt?: Date;
      tags?: { hasSome: string[] };
      isPublished?: boolean;
      OR?: Array<
        | { title: { contains: string; mode: 'insensitive' } }
        | { description: { contains: string; mode: 'insensitive' } }
      >;
    } = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters.level) {
      where.level = filters.level;
    }

    if (filters.createdAt) {
      where.createdAt = filters.createdAt;
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Get total count of courses with filters applied
    const totalCount = await this.prisma.course.count({ where });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated courses with their relations
    const courses = await this.prisma.course.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc', // Sort by newest first
      },
    });
    // Return pagination metadata along with the courses
    return {
      data: courses,
      meta: {
        totalCount,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
  async findByCategoryId(categoryId: string) {
    return this.prisma.course.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
    });
  }
  async findAllStructure(
    filters: {
      categoryId?: string;
      isPublished?: boolean;
      search?: string;
    } = {},
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    // Build where conditions based on filters
    const where: {
      categoryId?: string;
      isPublished?: boolean;
      OR?: Array<
        | { title: { contains: string; mode: 'insensitive' } }
        | { description: { contains: string; mode: 'insensitive' } }
      >;
    } = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.isPublished !== undefined) {
      where.isPublished = filters.isPublished;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Get total count of courses with filters applied
    const totalCount = await this.prisma.course.count({ where });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated courses with their relations
    const courses = await this.prisma.course.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc', // Sort by newest first
      },
    });

    // Return pagination metadata along with the courses
    return {
      data: courses,
      meta: {
        totalCount,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // Lấy chi tiết khóa học theo ID
  async findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        chapters: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
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

  // Lấy thống kê khóa học
  async getStats() {
    // Tổng số khóa học
    const totalCourses = await this.prisma.course.count();
    console.log(totalCourses);
    // Số khóa học đang hoạt động (đã publish)
    const activeCourses = await this.prisma.course.count({
      where: { isPublished: true },
    });
    return {
      totalCourses,
      activeCourses,
    };
  }
}
