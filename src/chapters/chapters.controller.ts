import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Controller()
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post('courses/:courseId/chapters')
  createForCourse(
    @Param('courseId') courseId: string,
    @Body() createChapterDto: CreateChapterDto,
  ) {
    return this.chaptersService.create({
      ...createChapterDto,
      courseId: courseId,
    });
  }

  @Get('courses/:courseId/chapters')
  findByCourse(@Param('courseId') courseId: string) {
    return this.chaptersService.findByCourse(courseId);
  }

  @Get('chapters/:id')
  findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(id);
  }

  @Patch('chapters/:id')
  update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(id, updateChapterDto);
  }

  @Delete('chapters/:id')
  remove(@Param('id') id: string) {
    return this.chaptersService.remove(id);
  }
}
