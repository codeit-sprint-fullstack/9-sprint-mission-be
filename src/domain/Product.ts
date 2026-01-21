export class Product {
  public id: number;
  public ownerId: number;
  public name: string;
  public description: string;
  public price: number;
  public tags: string[];
  public images: string[];
  public createdAt: Date;
  public updatedAt: Date;
  private _likes: Array<{ userId: number }>;

  constructor({
    id,
    ownerId,
    name,
    description,
    price,
    tags,
    images,
    createdAt,
    updatedAt,
    likes,
  }: {
    id: number;
    ownerId: number;
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    likes?: Array<{ userId: number }>;
  }) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this._likes = likes ?? [];
  }

  set likes(likes: Array<{ userId: number }>) {
    this._likes = likes;
  }

  get isFavorite(): (userId: number | null) => boolean {
    return (userId: number | null) => {
      if (!userId) return false;
      return this._likes.some((like) => like.userId === userId);
    };
  }

  get favoriteCount(): number {
    return this._likes.length;
  }
}
