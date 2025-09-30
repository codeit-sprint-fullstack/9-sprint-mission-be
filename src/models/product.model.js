import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  },
);

productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Product = mongoose.model('Product', productSchema);
