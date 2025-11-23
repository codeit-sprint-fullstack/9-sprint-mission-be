import { jest } from "@jest/globals";
import { ItemService } from "../../../services/item.service.js";
import { prismaItemStub, itemInputStub } from "../item.stub.js";
import { NotFoundException } from "../../../common/exceptions/notFoundException.js";
import { NOT_FOUND_ITEM } from "../../../common/constants/errorMessage.js";

const MockItemRepository = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe("ItemService 단위 테스트", () => {
  let itemService;

  beforeEach(() => {
    jest.clearAllMocks();

    itemService = new ItemService(MockItemRepository);
  });

  // red or green test
  it("1 - create 레포 호출하여 아이템 생성 성공", async () => {
    MockItemRepository.create.mockResolvedValue(prismaItemStub);

    const result = await itemService.createItem(itemInputStub);

    // 주입받은 레포의 create가 호출? red or green
    expect(MockItemRepository.create).toHaveBeenCalledTimes(1);

    //서비스에서 받은 입력 데이터로 호출?
    expect(MockItemRepository.create).toHaveBeenCalledWith(itemInputStub);

    // 서비스가 Repository의 결과를 올바르게 반환?
    expect(result).toEqual(prismaItemStub);
  });

  it("2 - 아이템 조회 성공", async () => {
    MockItemRepository.findById.mockResolvedValue(prismaItemStub);

    const id = 1;
    const item = await itemService.getItemById(id);

    expect(MockItemRepository.findById).toHaveBeenCalledWith(id);
    expect(item).toEqual(prismaItemStub);
  });

  it("3. 아이템이 없을 경우 NotFoundException", async () => {
    // null을 반환 (아이템을 못 찾음) => 메시지 가 맞나
    MockItemRepository.findById.mockResolvedValue(null);

    const id = 999;

    await expect(itemService.getItemById(id)).rejects.toThrow(
      NotFoundException
    );
    await expect(itemService.getItemById(id)).rejects.toThrow(NOT_FOUND_ITEM);

    expect(MockItemRepository.findById).toHaveBeenCalledWith(id);
  });
});
