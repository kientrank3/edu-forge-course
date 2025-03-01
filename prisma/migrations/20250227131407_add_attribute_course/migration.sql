/*
  Warnings:

  - Added the required column `targetAudience` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "learningOutcomes" TEXT[],
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "targetAudience" TEXT NOT NULL;
