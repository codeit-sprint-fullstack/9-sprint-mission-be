export class Article {
  public id: number;
  public writerId: number;
  public title: string;
  public content: string;
  public image: string | null;
  public createdAt: Date;
  public updatedAt: Date;
  private _likes: Array<{ userId: number }>;

  constructor({
    id,
    writerId,
    title,
    content,
    image,
    createdAt,
    updatedAt,
    likes,
  }: {
    id: number;
    writerId: number;
    title: string;
    content: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    likes?: Array<{ userId: number }>;
  }) {
    this.id = id;
    this.writerId = writerId;
    this.title = title;
    this.content = content;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this._likes = likes || [];
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
