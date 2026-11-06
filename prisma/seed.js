import bcrypt from 'bcrypt';
import 'dotenv/config';
import prisma from '../src/config/db.js';

try {
  await prisma.$queryRaw`TRUNCATE posts, users RESTART IDENTITY CASCADE;`;

  const usersData = [
    { email: 'alice@test.com', password: 'alice1234' },
    { email: 'bob@example.com', password: 'bob1234' },
    { email: 'charlie@demo.com', password: 'charlie1234', role: 'ADMIN' },
  ];

  const users = [];

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'USER',
      },
    });

    users.push(user);
  }

  for (const user of users) {
    await prisma.post.createMany({
      data: [
        {
          title: `Welcome Post by ${user.email.split('@')[0]}`,
          content: `This is the first post by ${user.email.split('@')[0]}.`,
          authorId: user.id,
        },
        {
          title: `Thoughts by ${user.email.split('@')[0]}`,
          content: `Another insightful post by ${user.email.split('@')[0]}.`,
          authorId: user.id,
        },
      ],
    });
  }

  console.log('Seed completed successfully!');
} catch (error) {
  console.error('Seed failed:', error);
} finally {
  await prisma.$disconnect();
}
