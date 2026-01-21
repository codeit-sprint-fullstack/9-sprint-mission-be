import { PrismaClient } from "@prisma/client";
import { UserMocks } from "./mocks/userMocks";
import { ArticleMocks } from "./mocks/articleMocks";
import { ProductMocks } from "./mocks/productMocks";
import { CommentMocks } from "./mocks/comments";
import { LikeMocks } from "./mocks/likeMocks";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.user.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();

  // 목 데이터 삽입
  await prisma.user.createMany({
    data: UserMocks,
    skipDuplicates: true,
  });
  await prisma.article.createMany({
    data: ArticleMocks,
    skipDuplicates: true,
  });
  await prisma.product.createMany({
    data: ProductMocks,
    skipDuplicates: true,
  });
  await prisma.comment.createMany({
    data: CommentMocks,
    skipDuplicates: true,
  });
  await prisma.like.createMany({
    data: LikeMocks,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
