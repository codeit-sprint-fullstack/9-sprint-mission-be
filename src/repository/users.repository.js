import { prisma } from '../db/prisma.js';

async function findUserById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findUserByEmail(email) {
  return await prisma.User.findUnique({
    where: {
      email,
    },
  });
}

async function createUser(user) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    },
  });
}

async function updateUserById(id, data) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

async function deleteUserById(id) {
  return prisma.user.delete({
    where: {
      id,
    },
  });
}

async function upsertUser(provider, providerId, email, nickname) {
  return prisma.user.upsert({
    where: { provider, providerId },
    update: { email, nickname },
    create: { provider, providerId, email, nickname },
  });
}

export default {
  findUserById,
  findUserByEmail,
  createUser,
  updateUserById,
  upsertUser,
  deleteUserById,
};
