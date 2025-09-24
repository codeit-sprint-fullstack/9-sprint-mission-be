import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { config } from "../config/config.js";

const seedProducts = [
  {
    name: "무선 이어폰",
    description: "선명한 사운드와 긴 배터리 수명을 자랑하는 최신 무선 이어폰입니다.",
    price: 129000,
    tags: "전자기기, 오디오, 무선",
  },
  {
    name: "스마트 워치",
    description: "건강 관리와 스마트 알림 기능을 갖춘 세련된 디자인의 스마트 워치입니다.",
    price: 250000,
    tags: "전자기기, 웨어러블, 스마트",
  },
  {
    name: "프리미엄 커피 원두",
    description: "깊고 풍부한 향을 느낄 수 있는 고품질 아라비카 원두입니다.",
    price: 18000,
    tags: "식품, 음료, 커피",
  },
  {
    name: "유기농 핸드크림",
    description: "천연 재료로 만들어 피부를 촉촉하고 부드럽게 가꿔주는 핸드크림입니다.",
    price: 15000,
    tags: "뷰티, 화장품, 유기농",
  },
  {
    name: "스웨이드 재킷",
    description: "부드러운 스웨이드 소재로 제작된 스타일리시한 재킷입니다.",
    price: 89000,
    tags: "의류, 패션, 재킷",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB에 연결되었습니다.");

    // 기존 데이터 삭제 (선택 사항)
    await Product.deleteMany({});
    console.log("기존 Product 데이터가 삭제되었습니다.");

    // 시드 데이터 삽입
    await Product.insertMany(seedProducts);
    console.log("시드 데이터가 성공적으로 추가되었습니다!");

  } catch (error) {
    console.error("데이터 시딩 중 오류 발생:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB 연결이 종료되었습니다.");
  }
}

seedDatabase();
