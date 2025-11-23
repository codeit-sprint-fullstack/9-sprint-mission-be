export const prismaItemStub = {
  id: "ctxi223mdsf2323jkasdf",
  name: "테스트 아이템",
  description: "라떼는 말이야",
  price: 10000,
  userId: "asdfiawkefawf",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const prismaItemsStub = [
  { ...prismaItemStub, id: "askdawd" },
  { ...prismaItemStub, id: "askdawd2", name: "다른 아이템" },
];

export const itemInputStub = {
  name: "새 아이템",
  description: "새 라떼 설명",
  price: 5000,
};

export const itemUpdateStub = {
  price: 7500,
};
