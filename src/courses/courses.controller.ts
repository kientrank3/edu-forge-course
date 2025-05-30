import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseLevel } from './dto/create-course.dto';
// import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('courses')
// @UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  // API: Tạo khóa học
  @Post()
  async createCourse(
    @Body() data: CreateCourseDto,
    @Headers('X-User-Id') requestUserId: string,
  ) {
    return this.courseService.createCourse({ ...data, ownerId: requestUserId });
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('level') level?: string,
    @Query('createdAt') createdAt?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.courseService.findAll(
      {
        categoryId: categoryId ? categoryId : undefined,
        minPrice: minPrice ? +minPrice : undefined,
        maxPrice: maxPrice ? +maxPrice : undefined,
        level: level ? (level as CourseLevel) : undefined,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        search,
      },
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }
  @Get('category/:categoryId')
  findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.courseService.findByCategoryId(categoryId);
  }
  @Get('/all')
  async findAllCourses(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
    @Query('isPublished') isPublished?: string,
    @Query('search') search?: string,
  ) {
    return this.courseService.findAllStructure(
      {
        categoryId,
        isPublished:
          isPublished === 'true'
            ? true
            : isPublished === 'false'
              ? false
              : undefined,
        search,
      },
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  // API: Lấy chi tiết một khóa học theo ID
  @Get('stats')
  async getStats() {
    return this.courseService.getStats();
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  // API: Cập nhật khóa học
  @Patch(':id')
  async updateCourse(@Param('id') id: string, @Body() data: UpdateCourseDto) {
    return this.courseService.updateCourse(id, data);
  }

  @Get(':id/structure')
  async getCourseStructureById(@Param('id') id: string) {
    return await this.courseService.getCourseStructureById(id);
  }
  @Get('user/:userId/structure')
  async getCourseStructureByUserId(@Param('userId') requestUserId: string) {
    return await this.courseService.getCourseStructureByUserId(requestUserId);
  }

  // API: Xóa khóa học
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.courseService.publishCourse(id);
  }

  @Patch(':id/unpublish')
  unpublish(@Param('id') id: string) {
    return this.courseService.unpublishCourse(id);
  }
}
