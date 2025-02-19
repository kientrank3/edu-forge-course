import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { UserProgressService } from './user-process.service';
import { CreateUserProgressDto } from './dto/create-user-process.dto';
import { UpdateUserProgressDto } from './dto/update-user-process.dto';

@Controller('user-progress')
export class UserProgressController {
  constructor(
    @Inject(UserProgressService)
    private readonly userProgressService: UserProgressService,
  ) {}

  @Post()
  create(@Body() createUserProgressDto: CreateUserProgressDto) {
    return this.userProgressService.create(createUserProgressDto);
  }

  @Get()
  findAll() {
    return this.userProgressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userProgressService.findOne(id);
  }

  @Get('user/:userId/course/:courseId')
  findByUserAndCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.userProgressService.findByUserAndCourse(userId, courseId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserProgressDto: UpdateUserProgressDto,
  ) {
    return this.userProgressService.update(id, updateUserProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userProgressService.remove(id);
  }
}
