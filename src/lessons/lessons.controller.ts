// src/lessons/lessons.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonsService } from './lessons.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('courses/:courseId/chapters/:chapterId/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.lessonsService.create(courseId, chapterId, createLessonDto);
  }

  @Get()
  findAllByChapterId(@Param('chapterId') chapterId: string) {
    return this.lessonsService.findAllByChapterId(chapterId);
  }

  @Get('all')
  findAllByCourseId(@Param('courseId') courseId: string) {
    return this.lessonsService.findAllByCourseId(courseId);
  }

  @Get(':id')
  findOne(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Param('id') id: string,
  ) {
    return this.lessonsService.findOne(courseId, chapterId, id);
  }

  @Put(':id')
  update(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(courseId, chapterId, id, updateLessonDto);
  }

  @Delete(':id')
  remove(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Param('id') id: string,
  ) {
    return this.lessonsService.remove(courseId, chapterId, id);
  }
}
