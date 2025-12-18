import cuid from "cuid";

export const mockId = cuid();

export const mockUserBuildArgs = {
  email: "public.panda@naver.com",
  username: "panda주인장",
};

export const mockUsers = Array(100)
  .fill(0)
  .map((v, index) => {
    return {
      id: cuid(),
      email: `panda-baby_${index}@gmail.com`,
      username: `panda-baby_${index}`,
    };
  });

export const mockUser = {
  id: "cmia25r560000pzsby1dy2sot",
  email: "public.panda@naver.com",
  username: "panda주인장",
  createdAt: "2025-11-22 12:10:00",
};
