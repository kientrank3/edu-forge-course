import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Tạo dữ liệu mẫu cho bảng Category
  const categories = await prisma.category.createMany({
    data: [
      {
        name: 'Web Development',
        description: 'Learn how to build modern web applications.',
      },
      {
        name: 'Mobile Development',
        description: 'Learn how to build mobile applications.',
      },
      {
        name: 'Data Science',
        description: 'Learn how to analyze and visualize data.',
      },
      {
        name: 'Machine Learning',
        description: 'Learn how to build machine learning models.',
      },
      {
        name: 'DevOps',
        description: 'Learn how to manage and deploy applications.',
      },
    ],
  });

  // Lấy danh sách các danh mục đã tạo
  const categoryList = await prisma.category.findMany();

  // Tạo dữ liệu mẫu cho bảng Course
  const courses = await prisma.course.createMany({
    data: [
      {
        title: 'React for Beginners',
        description: 'Learn React from scratch.',
        categoryId: categoryList[0].id,
        ownerId: '1',
        level: 'BEGINNER',
      },
      {
        title: 'Advanced React',
        description: 'Master React with advanced techniques.',
        categoryId: categoryList[0].id,
        ownerId: '1',
        level: 'ADVANCED',
      },
      {
        title: 'Flutter Basics',
        description: 'Learn Flutter for mobile development.',
        categoryId: categoryList[1].id,
        ownerId: '1',
        level: 'BEGINNER',
      },
      {
        title: 'Data Science with Python',
        description: 'Learn data science using Python.',
        categoryId: categoryList[2].id,
        ownerId: '1',
        level: 'INTERMEDIATE',
      },
      {
        title: 'Introduction to Machine Learning',
        description: 'Learn the basics of machine learning.',
        categoryId: categoryList[3].id,
        ownerId: '1',
        level: 'BEGINNER',
      },
    ],
  });

  // Lấy danh sách các khóa học đã tạo
  const courseList = await prisma.course.findMany();

  // Tạo dữ liệu mẫu cho bảng Chapter
  const chapters = await prisma.chapter.createMany({
    data: [
      {
        title: 'Introduction to React',
        description: 'Get started with React.',
        courseId: courseList[0].id,
        order: 1,
      },
      {
        title: 'Components and Props',
        description: 'Learn about React components and props.',
        courseId: courseList[0].id,
        order: 2,
      },
      {
        title: 'State and Lifecycle',
        description: 'Understand state and lifecycle methods.',
        courseId: courseList[0].id,
        order: 3,
      },
      {
        title: 'Flutter Widgets',
        description: 'Learn about Flutter widgets.',
        courseId: courseList[2].id,
        order: 1,
      },
      {
        title: 'Data Visualization',
        description: 'Learn how to visualize data.',
        courseId: courseList[3].id,
        order: 1,
      },
    ],
  });

  // Lấy danh sách các chương đã tạo
  const chapterList = await prisma.chapter.findMany();

  // Tạo dữ liệu mẫu cho bảng Lesson
  const lessons = await prisma.lesson.createMany({
    data: [
      {
        title: 'What is React?',
        content: 'Introduction to React.',
        chapterId: chapterList[0].id,
        order: 1,
        type: 'BLOG',
      },
      {
        title: 'Creating Components',
        content: 'How to create React components.',
        chapterId: chapterList[1].id,
        order: 1,
        type: 'BLOG',
      },
      {
        title: 'Understanding State',
        content: 'Learn about state in React.',
        chapterId: chapterList[2].id,
        order: 1,
        type: 'BLOG',
      },
      {
        title: 'Introduction to Widgets',
        content: 'Learn about Flutter widgets.',
        chapterId: chapterList[3].id,
        order: 1,
        type: 'BLOG',
      },
      {
        title: 'Data Visualization Basics',
        content: 'Introduction to data visualization.',
        chapterId: chapterList[4].id,
        order: 1,
        type: 'BLOG',
      },
    ],
  });

  console.log({ categories, courses, chapters, lessons });
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
