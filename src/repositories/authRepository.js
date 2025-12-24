import prisma from "../config/prisma.js";

async function findByEmail(email) {
  return await prisma.User.findUnique({
    where: {
      email,
    },
  });
}
async function findById(id) {
  return await prisma.User.findUnique({
    where: {
      id,
    },
  });
}

async function save(user) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickName: user.nickName,
      password: user.password,
    },
  });
}

async function update(id, data) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

export default {
  findByEmail,
  findById,
  save,
  update,
};
