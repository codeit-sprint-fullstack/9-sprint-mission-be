/** @see https://inpa.tistory.com/entry/EXPRESS-%F0%9F%93%9A-multer-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4 */
import type { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { BadRequestException } from "../common/exceptions/error";
import { v4 as uuidv4 } from "uuid";

/** uploads 디렉토리 설정 및 초기화 */
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/**
 *  storage setting: dev env -> LocalDisk | Production -> multerS3
 */
// const storage = isProduction ? multerS3(S3) : multer.diskStorage(기존로컬)
const storage = multer.diskStorage({
  // 저장위치
  destination: (_req: Request, _file: Express.Multer.File, done): void => {
    done(null, uploadDir);
  },
  // 파일 이름 생성 규칙: UUID를 사용하여 중복 방지
  filename: (_req: Request, file: Express.Multer.File, done): void => {
    const randomId = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${randomId}${ext}`;
    done(null, filename);
  },
});

/**  파일 필터링: 허용된 확장자(JPEG, JPG, PNG)만 업로드 허용 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  done: FileFilterCallback
): void => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    done(null, true);
  } else {
    done(new BadRequestException("이미지 파일(jpg,png)만 업로드 가능합니다."));
  }
};

/**
 * Multer Setting Object
 * - FileLimit: 5MB
 * - Storage + FileFilter
 */
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
