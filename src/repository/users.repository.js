import prisma from '../config/prisma.js';

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
      name: user.name,
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

async function upsertUser(provider, providerId, email, name) {
  return prisma.user.upsert({
    where: { provider, providerId },
    update: { email, name },
    create: { provider, providerId, email, name },
  });
}

export default {
  findUserById,
  findUserByEmail,
  createUser,
  updateUserById,
  upsertUser,
};
