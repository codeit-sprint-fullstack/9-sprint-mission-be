/** @see https://inpa.tistory.com/entry/EXPRESS-%F0%9F%93%9A-multer-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4 */
import type { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { BadRequestException } from "../common/exceptions/error";
import { v4 as uuidv4 } from "uuid";
import { S3Client } from "@aws-sdk/client-s3";
import { config } from "@config/config";

/** uploads 디렉토리 설정 및 초기화 */
// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 *  storage setting: dev env -> LocalDisk | Production -> multerS3
 */
// const storage = isProduction ? multerS3(S3) : multer.diskStorage(기존로컬)
const storage = multerS3({
  s3: s3,
  bucket: config.AWS_S3_BUCKET_NAME,
  acl: "public-read", // 권한: 업로드된 파일을 외부에서 읽을 수 있게 한다.
  contentType: multerS3.AUTO_CONTENT_TYPE, // 파일 mimetype 자동 설정 (매우 중요!)
  key: (_req, file, done) => {
    const randomId = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `uploads/${randomId}${ext}`;
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
