/*
  Warnings:

  - You are about to drop the `UserProgress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[order]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserProgress" DROP CONSTRAINT "UserProgress_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UserProgress" DROP CONSTRAINT "UserProgress_lessonId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "isHasCertificate" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "UserProgress";

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_order_key" ON "Chapter"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_order_key" ON "Lesson"("order");
