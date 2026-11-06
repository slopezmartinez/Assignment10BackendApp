import prisma from '../config/db.js';

export async function getAll({ search, sortBy, order, offset, limit }) {
  const conditions = {};
  if (search) {
    conditions.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }
  const posts = await prisma.post.findMany({
    where: conditions,
    orderBy: { [sortBy]: order },
    take: limit,
    skip: offset,
  });
  return posts;
}

export async function getById(id) {
  const post = await prisma.post.findUnique({ where: { id } });
  return post;
}

export function create(postData) {
  const newPost = prisma.post.create({ data: postData });
  return newPost;
}

export async function update(id, updatedData) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: updatedData,
    });
    return updatedPost;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedPost = await prisma.post.delete({
      where: { id },
    });
    return deletedPost;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
