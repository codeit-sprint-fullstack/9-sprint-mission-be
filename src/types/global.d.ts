declare namespace Express {
  export interface Request {
    valid?: boolean;
    auth?: {
      id: string;
      email: string;
      iat: number;
      exp: number;
      // JWT Payload
    };
  }
}
