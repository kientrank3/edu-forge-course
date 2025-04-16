// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Kiểm tra name có tồn tại không
    if (!createCategoryDto || !createCategoryDto.name) {
      throw new Error('Category name is required');
    }

    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Kiểm tra id có tồn tại không
    if (!id) {
      throw new Error('Category ID is required');
    }

    // Kiểm tra updateCategoryDto có tồn tại không
    if (!updateCategoryDto || Object.keys(updateCategoryDto).length === 0) {
      throw new Error('Update data is required');
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
        description: updateCategoryDto.description,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
