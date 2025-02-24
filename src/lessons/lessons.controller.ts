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

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post('courses/:courseId/chapters/:chapterId')
  create(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.lessonsService.create(courseId, chapterId, createLessonDto);
  }

  @Get('chapters/:chapterId')
  findAllByChapterId(@Param('chapterId') chapterId: string) {
    return this.lessonsService.findAllByChapterId(chapterId);
  }

  @Get('courses/:courseId')
  findAllByCourseId(@Param('courseId') courseId: string) {
    return this.lessonsService.findAllByCourseId(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOneById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
