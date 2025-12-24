import { NextFunction, Request, Router, type Response } from "express";
import { UnAuthorizedException } from "../common/exceptions/error";

/** 컨트롤러의 부모 추상 클래스 */
export abstract class BaseController {
  protected router: Router;

  constructor() {
    this.router = Router();
  }

  /**
   * 라우터를 초기화하고 반환하는 추상 메서드
   * 자식 클래스에서 반드시 구현.
   * TODO: 응집도상승 + DI Container + route파일제거 or 간소화
   */
  // public abstract initializeRoutes(): Router;

  /**
   * 인증된 사용자의 ID를 가져오는 헬퍼 메서드
   * @throws {UnAuthorizedException} 인증 정보가 없을 경우 예외 발생
   */
  protected getUserId(req: Request): string {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new UnAuthorizedException("인증 정보가 유효하지 않습니다.");
    }
    return userId;
  }

  /**  next(error)를 통해 전역 errorHandler로 갑니다.*/
  protected nextError(next: NextFunction, error: unknown): void {
    next(error);
  }
  /** 공통 성공 응답 형식 */
  protected sendSuccess<T>(
    res: Response,
    data: T,
    message = "Success",
    status = 200
  ): Response {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }
}
