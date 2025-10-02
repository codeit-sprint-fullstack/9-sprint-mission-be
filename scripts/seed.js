import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log(
    '시딩을 시작합니다... (모든 작업은 단일 트랜잭션으로 실행됩니다)',
  );

  await prisma.$transaction(async (tx) => {
    // 1. 기존 데이터 삭제
    console.log('기존 데이터를 삭제합니다...');
    await tx.comment.deleteMany();
    await tx.article.deleteMany();
    await tx.product.deleteMany();
    console.log('기존 데이터 삭제 완료.');

    const DATA_LENGTH = 15;
    const paragraphCount = Math.max(1, Math.floor(Math.random() * 5));

    // 2. Article 15개 생성
    console.log('Article 데이터를 생성합니다...');
    const articleCreatePromises = Array.from({ length: DATA_LENGTH }).map(() =>
      tx.article.create({
        data: {
          title: faker.lorem.sentence({ min: 5, max: 10 }),
          content: faker.lorem.paragraphs(paragraphCount),
        },
      }),
    );
    const articles = await Promise.all(articleCreatePromises);
    console.log(`${articles.length}개의 Article이 생성되었습니다.`);

    // 3. Product 15개 생성
    console.log('Product 데이터를 생성합니다...');
    const productCreatePromises = Array.from({ length: DATA_LENGTH }).map(() =>
      tx.product.create({
        data: {
          name: faker.commerce.productName({ max: 10 }),
          description: faker.commerce.productDescription({ min: 10, max: 100 }),
          price: faker.commerce.price({ min: 10000, max: 200000 }),
          tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
            faker.commerce.department(),
          ),
        },
      }),
    );
    const products = await Promise.all(productCreatePromises);
    console.log(`${products.length}개의 Product가 생성되었습니다.`);

    // 4. Article에 대한 Comment 생성
    console.log('Article에 대한 Comment를 생성합니다...');
    const articleCommentsData = articles.flatMap((article) =>
      Array.from({ length: 3 }).map(() => ({
        content: faker.lorem.sentence({ min: 10, max: 25 }),
        parent: 'Article',
        articleId: article.id,
      })),
    );
    const { count: articleCommentCount } = await tx.comment.createMany({
      data: articleCommentsData,
    });
    console.log(`${articleCommentCount}개의 Article Comment가 생성되었습니다.`);

    // 5. Product에 대한 Comment 생성
    console.log('Product에 대한 Comment를 생성합니다...');
    const productCommentsData = products.flatMap((product) =>
      Array.from({ length: 3 }).map(() => ({
        content: faker.lorem.sentence({ min: 10, max: 25 }),
        parent: 'Product',
        productId: product.id,
      })),
    );
    const { count: productCommentCount } = await tx.comment.createMany({
      data: productCommentsData,
    });
    console.log(`${productCommentCount}개의 Product Comment가 생성되었습니다.`);
  });

  console.log('시딩이 완료되었습니다.');
}

main()
  .catch((err) => {
    console.error('시딩 중 오류가 발생했습니다:', err);
    process.exit(1);
  })
  .finally(async () => {
    // 스크립트 종료 시 Prisma Client 연결 해제
    await prisma.$disconnect();
  });
