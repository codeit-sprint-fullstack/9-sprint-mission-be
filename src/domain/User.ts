export class User {
  public id: number;
  public email: string;
  public nickname: string;
  public image: string | null;
  public createdAt: Date;
  public updatedAt: Date;
  private _password: string;

  constructor({
    id,
    email,
    nickname,
    image,
    createdAt,
    updatedAt,
    password,
  }: {
    id: number;
    email: string;
    nickname: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    password: string;
  }) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this._password = password;
  }

  set password(newPassword: string) {
    this._password = newPassword;
  }

  checkPassword(password: string): boolean {
    return this._password === password;
  }
}
