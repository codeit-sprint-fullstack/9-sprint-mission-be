import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    tags: { type: String },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// name, description에 포함된 단어로 검색 -> 복합 인덱스
productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema, "products");
