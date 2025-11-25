import express from 'express';
import multer from 'multer';
import path from 'path';

export const uploadsRouter = express.Router();

// Multer 설정: 이미지 파일만 허용하고, 'uploads/' 디렉토리에 저장
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 파일이 저장될 경로
  },
  filename: (req, file, cb) => {
    // 파일 원본 이름에 타임스탬프와 확장자를 붙여 고유한 파일명 생성
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // 이미지 파일(jpeg, png, gif)만 허용
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/gif'
    ) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
    }
  },
});

// 이미지 업로드 라우트
// 클라이언트에서 'image'라는 key(field name)로 파일을 보내야 합니다.
uploadsRouter.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
  }
  // 클라이언트에게 파일이 저장된 경로를 반환
  res.json({ url: `/uploads/${req.file.filename}` });
});
