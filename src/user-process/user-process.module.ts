import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserProgressController } from './user-process.controller';
import { UserProgressService } from './user-process.service';

@Module({
  controllers: [UserProgressController],
  providers: [UserProgressService, PrismaService],
})
export class UserProgressModule {}
