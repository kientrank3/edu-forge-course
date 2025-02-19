import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
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
  async createCourse(@Body() data: CreateCourseDto & { ownerId: string }) {
    return this.courseService.createCourse(data);
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('level') level?: string,
    @Query('minDuration') minDuration?: string,
    @Query('maxDuration') maxDuration?: string,
    @Query('createdAt') createdAt?: string,
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
      },
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  // API: Lấy chi tiết một khóa học theo ID
  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  // API: Cập nhật khóa học
  @Patch(':id')
  async updateCourse(
    @Param('id', ParseIntPipe) id: string,
    @Body() data: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, data);
  }

  @Get(':id/structure')
  async getCourseStructure(@Param('id') id: string) {
    return await this.courseService.getCourseStructure(id);
  }

  // API: Xóa khóa học
  @Delete(':id')
  async deleteCourse(@Param('id', ParseIntPipe) id: string) {
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
