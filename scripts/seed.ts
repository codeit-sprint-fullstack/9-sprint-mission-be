import { PrismaClient } from "../src/generated/client";
import { faker } from "@faker-js/faker/locale/ko";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const NUM_USERS_TO_CREATE = 5;
  console.log("시딩 시작");

  const userPromise = Array.from({ length: NUM_USERS_TO_CREATE }).map(() =>
    prisma.user.create({
      data: {
        nickname: faker.person.fullName(),
        email: faker.internet.email(),
        encryptedPassword: faker.internet.password(),
        userProfile: {
          create: {
            photoUrl: faker.image.avatar(),
            bio: faker.person.bio(),
          },
        },
      },
    })
  );

  const users = await Promise.all(userPromise);

  const allPosts = [];
  for (const user of users) {
    const postCount = faker.number.int({ min: 1, max: 5 });
    const postPromises = Array.from({ length: NUM_USERS_TO_CREATE }).map(() => {
      const randomUser =
        users[faker.number.int({ min: 0, max: users.length - 1 })];
      return prisma.article.create({
        data: {
          title: faker.lorem.sentence({ min: 3, max: 14 }),
          content: faker.lorem.paragraph({ min: 2, max: 7 }),
          images: [
            faker.image.urlPicsumPhotos({ width: 100, height: 100 }),
            faker.image.urlPicsumPhotos({ width: 100, height: 100 }),
            faker.image.urlPicsumPhotos({ width: 100, height: 100 }),
          ],
          authorId: randomUser.id,
        },
      });
    });

    const userPosts = await Promise.all(postPromises);
    allPosts.push(...userPosts);
  }
  console.log(`${allPosts.length}개의 게시물이 생성되었습니다.`);

  for (const user of users) {
    const itemCount = faker.number.int({ min: 1, max: 7 });
    const itemPromises = Array.from({ length: itemCount }).map(() => {
      const randomUser =
        users[faker.number.int({ min: 0, max: users.length - 1 })];
      return prisma.item.create({
        data: {
          authorId: randomUser.id,
          name: faker.commerce.product(),
          description: faker.lorem.paragraph({ min: 2, max: 7 }),
          price: faker.commerce.price({ min: 1000, symbol: "₩" }),
        },
      });
    });

    await Promise.all(itemPromises);
  }

  for (const post of allPosts) {
    const commentCount = faker.number.int({ min: 1, max: 10 });
    const commentPromises = Array.from({ length: commentCount }).map(() => {
      const randomUser =
        users[faker.number.int({ min: 0, max: users.length - 1 })];
      return prisma.itemComment.create({
        data: {
          context: faker.lorem.sentences({ min: 1, max: 3 }),
          userId: randomUser.id,
          itemId: post.id,
        },
      });
    });

    await Promise.all(commentPromises);
  }

  console.log(`${users.length}명의 유저가 생성되었습니다.`);
  console.log("데이터 시딩 완료");
}
main()
  .catch((e) => {
    console.error("Seeding Error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
