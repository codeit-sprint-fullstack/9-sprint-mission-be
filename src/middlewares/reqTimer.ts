import type { RequestHandler } from "express";

/** 요청 시간을 측정하고 로그를 남기는 미들웨어 */
// RequestHandler 를 포함여여 req,res,next 에 따로따로 타입을 정의해도 좋습니다.
export const reqTimer: RequestHandler = (req, res, next) => {
  // 더 정밀한 추적이 필요할경우 ms 소수점 단위까지 측정가능(프로젝트가 커지면)
  // const startTime = performance.now();
  // const duration = (performance.now()  - startTime).toFixed(3)
  const startTime = Date.now();

  //finish 이벤트는 응답이 클라이언트에게 완전히 전송되었을때 발생
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    // Timer - method - URL - statusCode - time 을 함께 출력
    console.log(
      `[Timer]: ${method} ${originalUrl} ${statusCode} ${duration}ms`
    );
  });

  next();
};
