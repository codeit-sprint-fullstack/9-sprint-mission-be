export class Comment {
  public id: number;
  public writerId: number;
  public articleId: number | null;
  public productId: number | null;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor({
    id,
    writerId,
    articleId,
    productId,
    content,
    createdAt,
    updatedAt,
  }: {
    id: number;
    writerId: number;
    articleId: number | null;
    productId: number | null;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = id;
    this.writerId = writerId;
    this.articleId = articleId;
    this.productId = productId;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
