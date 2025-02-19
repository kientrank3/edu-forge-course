import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserProgressDto } from './dto/create-user-process.dto';
import { UpdateUserProgressDto } from './dto/update-user-process.dto';

@Injectable()
export class UserProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserProgressDto: CreateUserProgressDto) {
    // Kiểm tra xem khóa học và bài học có tồn tại không
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: createUserProgressDto.lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.prisma.userProgress.create({
      data: createUserProgressDto,
    });
  }

  async findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.prisma.userProgress.findMany({
      include: {
        course: true,
        lesson: true,
      },
    });
  }

  /**
   * Lấy tiến trình học theo ID
   * @param id ID của tiến trình học
   * @returns Tiến trình học nếu tìm thấy
   */
  async findOne(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const progress = await this.prisma.userProgress.findUnique({
      where: { id },
      include: {
        course: true,
        lesson: true,
      },
    });

    if (!progress) {
      throw new NotFoundException('User progress not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return progress;
  }

  /**
   * Lấy tiến trình học của một user trong một khóa học
   * @param userId ID của người dùng
   * @param courseId ID của khóa học
   * @returns Tiến trình học của user trong khóa học
   */
  async findByUserAndCourse(userId: string, courseId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const progressList = await this.prisma.userProgress.findMany({
      where: { userId, courseId },
      include: {
        lesson: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!progressList.length) {
      throw new NotFoundException(
        'No progress found for this user in the specified course',
      );
    }

    // Tính toán tiến trình tổng thể
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const totalLessons = progressList.length;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const completedLessons = progressList.filter((p) => p.isCompleted).length;
    const overallProgress =
      totalLessons > 0 ? completedLessons / totalLessons : 0;

    return {
      userId,
      courseId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      totalLessons,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      completedLessons,
      overallProgress,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      progressList,
    };
  }

  /**
   * Cập nhật tiến trình học theo ID
   * @param id ID của tiến trình học
   * @param updateUserProgressDto Dữ liệu cập nhật
   * @returns Tiến trình học đã cập nhật
   */
  async update(id: string, updateUserProgressDto: UpdateUserProgressDto) {
    await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.userProgress.update({
      where: { id },
      data: {
        ...updateUserProgressDto,
      },
    });
  }

  /**
   * Xóa tiến trình học theo ID
   * @param id ID của tiến trình học
   * @returns Tiến trình học đã bị xóa
   */
  async remove(id: string) {
    await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.userProgress.delete({
      where: { id },
    });
  }
}
