import { jest } from "@jest/globals";
import { ItemRepository } from "../../../repositories/item.repository.js";
import { prismaItemStub, itemInputStub } from "../item.stub.js";

describe("ItemRepository 단위 테스트", () => {
  let itemRepository;
  let mockPrismaClient;

  // Mock된 prisma 주입 (prisma 메소드 prisma.item.<method>)
  beforeEach(() => {
    mockPrismaClient = {
      item: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    itemRepository = new ItemRepository(mockPrismaClient);

    // mvc 각각 독립보장하기 위해 초기화
    jest.clearAllMocks();
  });

  it("1 - create Prisma의 create메서드 올바르게 호출", async () => {
    mockPrismaClient.item.create.mockResolvedValue(prismaItemStub);

    const newItem = await itemRepository.create(itemInputStub);

    // prisma.item.create 한 번 호출
    expect(mockPrismaClient.item.create).toHaveBeenCalledTimes(1);

    // itemInputStub이 포함남?
    expect(mockPrismaClient.item.create).toHaveBeenCalledWith({
      data: itemInputStub,
    });

    // 3. 나온값이 stub가짜 데이터베이스 객체과 동일?
    expect(newItem).toEqual(prismaItemStub);
  });

  it("2 - 아이템을 ID로 성공적으로 조회", async () => {
    mockPrismaClient.item.findUnique.mockResolvedValue(prismaItemStub);

    const id = 1;
    const item = await itemRepository.findById(id);

    expect(mockPrismaClient.item.findUnique).toHaveBeenCalledWith({
      where: { id },
      include: {
        user: true,
      },
    });
    expect(item).toEqual(prismaItemStub);
  });

  // 일단 간단히 호출만
  it("3 - 아이템을 ID로 업데이트 성공적", async () => {
    const id = 1;
    const updateData = { name: "Updated Item", price: 150 };
    const updatedItemStub = { id, ...updateData };

    mockPrismaClient.item.update.mockResolvedValue(updatedItemStub);
    const updatedItem = await itemRepository.update(id, updateData);

    expect(mockPrismaClient.item.update).toHaveBeenCalledWith({
      where: { id },
      data: updateData,
    });
    expect(updatedItem).toEqual(updatedItemStub);
  });

  it("4. deleteItem: 아이템을 ID로 성공적으로 삭제", async () => {
    const id = 1;
    mockPrismaClient.item.delete.mockResolvedValue(prismaItemStub);
    const deletedItem = await itemRepository.delete(id);

    expect(mockPrismaClient.item.delete).toHaveBeenCalledWith({
      where: { id },
    });
    expect(deletedItem).toEqual(prismaItemStub);
  });
});
