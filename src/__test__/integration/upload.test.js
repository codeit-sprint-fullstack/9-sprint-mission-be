import { jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../server.js";
import fs from "fs";
import path from "path";

describe("이미지 업로드 통합테스트 성공", () => {
  const testFilePath = path.join(__dirname, "test_image.jpg");

  beforeAll(() => {
    fs.writeFileSync(testFilePath, "spy image content");
  });

  afterAll(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it("POST /api/v1/images/upload -- 업로드 성공 URL", async () => {
    const res = await request(app)
      .post("/api/v1/images/upload")
      .attach("image", testFilePath, { contentType: "image/jpeg" })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toBeDefined();
    expect(res.body.data.url).toContain("/uploads/");
  });

  it("이미지 없이 요청 시 400에러 발생", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await request(app).post("/api/v1/images/upload").expect(400);

    consoleErrorSpy.mockRestore();
  });
});
