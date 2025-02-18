// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
