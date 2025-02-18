import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { CategoriesModule } from './categories/categories.module';
import { ChaptersModule } from './chapters/chapters.module';

@Module({
  imports: [CoursesModule, LessonsModule, CategoriesModule, ChaptersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
