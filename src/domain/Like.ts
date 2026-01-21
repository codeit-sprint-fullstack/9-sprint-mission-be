export class Like {
  public id: number;
  public userId: number;
  public productId: number | null;
  public articleId: number | null;
  public createdAt: Date;

  constructor({
    id,
    userId,
    productId,
    articleId,
    createdAt
  }: {
    id: number;
    userId: number;
    productId: number | null;
    articleId: number | null;
    createdAt: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this.productId = productId;
    this.articleId = articleId;
    this.createdAt = createdAt;
  }
}
