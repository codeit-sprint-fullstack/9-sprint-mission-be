import crypto from "crypto";

export class UserPasswordBuilder {
  static hashPassword(password: string): string {
    return crypto.createHash("sha512").update(password).digest("base64");
  }
}
