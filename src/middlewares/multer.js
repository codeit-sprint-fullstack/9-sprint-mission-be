/** @see https://inpa.tistory.com/entry/EXPRESS-%F0%9F%93%9A-multer-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4 */
import multer from "multer";
import path from "path";
import fs from "fs";
import { BadRequestException } from "../common/exceptions/index.js";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  // file sys mkdir
  fs.mkdirSync(uploadDir);
}

// local -> @TODO S3
const storage = multer.diskStorage({
  // 저장위치
  destination: (req, file, done) => {
    done(null, uploadDir);
  },
  filename: (req, file, done) => {
    // 확장자 ext
    const ext = path.extname(file.originalname);
    done(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

const fileFilter = (req, file, done) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    done(null, true);
  } else {
    done(
      new BadRequestException("이미지 파일(jpg,png)만 업로드 가능합니다."),
      false
    );
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // 5MB 제한
  limits: { fileSize: 5 * 1024 * 1024 },
});
