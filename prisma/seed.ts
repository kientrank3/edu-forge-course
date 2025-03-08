import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Tạo các danh mục (categories)
  await prisma.category.createMany({
    data: [
      {
        id: '55555555-5555-5555-5555-555555555555',
        name: 'Phát triển cá nhân',
        description: 'Khóa học kỹ năng mềm, giao tiếp, tư duy',
      },
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Lập trình',
        description: 'Khóa học lập trình từ cơ bản đến nâng cao',
      },
    ],
  });

  // Tạo các khóa học (courses)
  await prisma.course.createMany({
    data: [
      {
        id: '250c6539-e7b3-4d79-af09-debab6c0d75b',
        title: 'Phát triển tư duy phản biện',
        description: 'Học cách suy nghĩ logic và sáng tạo',
        categoryId: '55555555-5555-5555-5555-555555555555',
        isPublished: true,
        level: 'BEGINNER',
        ownerId: 'user5',
        price: 9.99,
        currency: 'VND',
        thumbnailUrl:
          'https://res.cloudinary.com/dxxsudprj/image/upload/v1740496946/clockscreen_diavzb.jpg',
        tags: ['Soft Skills', 'Mindset'],
        promotionPrice: null,
        isHasCertificate: false,
        totalLessons: 15,
        learningOutcomes: ['Cải thiện tư duy'],
        requirements: ['Không cần kinh nghiệm'],
        targetAudience: 'Mọi đối tượng',
      },
      {
        id: '353df7ee-27df-4082-b37f-aed42fc4a237',
        title: 'Lập trình JavaScript',
        description: 'Học JavaScript từ cơ bản đến nâng cao',
        categoryId: '11111111-1111-1111-1111-111111111111',
        isPublished: true,
        level: 'BEGINNER',
        ownerId: 'user1',
        price: 0,
        currency: 'VND',
        thumbnailUrl:
          'https://res.cloudinary.com/dxxsudprj/image/upload/v1740496946/clockscreen_diavzb.jpg',
        tags: ['JavaScript', 'Web'],
        promotionPrice: null,
        isHasCertificate: true,
        totalLessons: 15,
        learningOutcomes: ['Hiểu cơ bản về JS', 'Xây dựng web app'],
        requirements: ['Biết HTML & CSS'],
        targetAudience: 'Lập trình viên',
      },
    ],
  });

  // Tạo các chương (chapters) và bài học (lessons) cho khóa học 1
  await prisma.chapter.createMany({
    data: [
      {
        id: 'dfa74ae7-45c8-4d5c-a68a-1e8a06df21f1',
        title: 'Chương 1',
        description: 'Mô tả chương 1',
        order: 1,
        courseId: '250c6539-e7b3-4d79-af09-debab6c0d75b',
        isPublished: true,
      },
      {
        id: 'ef52e3bf-d803-4b95-a02a-48da5a7ae33e',
        title: 'Chương 2',
        description: 'Mô tả chương 2',
        order: 2,
        courseId: '250c6539-e7b3-4d79-af09-debab6c0d75b',
        isPublished: true,
      },
      {
        id: '9a8eddd5-26c6-4a95-aa77-049db7cfc388',
        title: 'Chương 3',
        description: 'Mô tả chương 3',
        order: 3,
        courseId: '250c6539-e7b3-4d79-af09-debab6c0d75b',
        isPublished: true,
      },
    ],
  });

  await prisma.lesson.createMany({
    data: [
      {
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        title: 'Thực hành tư duy phản biện',
        content: 'Bài tập thực tế',
        type: 'BLOG',
        videoUrl: null,
        order: 3,
        chapterId: 'dfa74ae7-45c8-4d5c-a68a-1e8a06df21f1',
        isPublished: true,
        isFreePreview: false,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Các bước cơ bản để suy nghĩ logic',
        content: 'Học cách phân tích vấn đề',
        type: 'VIDEO',
        videoUrl:
          'https://www.youtube.com/watch?v=T0sHaz4H9MQ&list=RDXFVNxCs97ys&index=11',
        order: 2,
        chapterId: 'dfa74ae7-45c8-4d5c-a68a-1e8a06df21f1',
        isPublished: true,
        isFreePreview: false,
      },
      {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        title: 'Giới thiệu về tư duy phản biện',
        content: 'Tìm hiểu khái niệm cơ bản',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=qQrgto184Tk',
        order: 1,
        chapterId: 'dfa74ae7-45c8-4d5c-a68a-1e8a06df21f1',
        isPublished: true,
        isFreePreview: false,
      },
    ],
  });

  // Tạo các chương (chapters) và bài học (lessons) cho khóa học 2
  await prisma.chapter.createMany({
    data: [
      {
        id: 'b95e092d-c391-43e2-a569-69b2c4af499b',
        title: 'Chương 1',
        description: 'Mô tả chương 1',
        order: 1,
        courseId: '353df7ee-27df-4082-b37f-aed42fc4a237',
        isPublished: true,
      },
      {
        id: '25fbd5b7-289e-4101-b165-0ba609dba912',
        title: 'Chương 2',
        description: 'Mô tả chương 2',
        order: 2,
        courseId: '353df7ee-27df-4082-b37f-aed42fc4a237',
        isPublished: true,
      },
      {
        id: '4640980b-63db-4ec8-afc0-8892bfa92d01',
        title: 'Chương 3',
        description: 'Mô tả chương 3',
        order: 3,
        courseId: '353df7ee-27df-4082-b37f-aed42fc4a237',
        isPublished: true,
      },
    ],
  });

  await prisma.lesson.createMany({
    data: [
      {
        id: 'd4e5f6g7-h8i9-40j1-k2l3-m4n5o6p7q8r9',
        title: 'Giới thiệu JavaScript',
        content: 'Tổng quan về ngôn ngữ',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=qQrgto184Tk',
        order: 1,
        chapterId: 'b95e092d-c391-43e2-a569-69b2c4af499b',
        isPublished: true,
        isFreePreview: true,
      },
      {
        id: 'e5f6g7h8-i9j0-41k2-l3m4-n5o6p7q8r9s0',
        title: 'Biến và kiểu dữ liệu',
        content: 'Cơ bản về cú pháp',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=qQrgto184Tk',
        order: 2,
        chapterId: 'b95e092d-c391-43e2-a569-69b2c4af499b',
        isPublished: true,
        isFreePreview: true,
      },
      {
        id: 'f6g7h8i9-j0k1-42l3-m4n5-o6p7q8r9s0t1',
        title: 'Câu lệnh điều kiện',
        content: 'Lập trình logic',
        type: 'MIXED',
        videoUrl: 'https://www.youtube.com/watch?v=qQrgto184Tk',
        order: 3,
        chapterId: 'b95e092d-c391-43e2-a569-69b2c4af499b',
        isPublished: true,
        isFreePreview: false,
      },
    ],
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
