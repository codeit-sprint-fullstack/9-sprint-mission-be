import path from "path";
import multer from "multer";
import fs from "fs";

const uploadDir = "public/img";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    cb(null, uploadDir);
  },
  filename: (req, file, done) => {
    const ext = path.extname(file.originalname);
    done(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
