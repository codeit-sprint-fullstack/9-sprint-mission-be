export default {
  testEnvironment: "node",
  transform: {
    // or 바벨과 같은 다른 트랜스파일러 사용가능
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: false,
          },
          target: "es2022",
        },
        module: {
          // Jest는 CJS 가 안정적
          type: "commonjs",
        },
      },
    ],
  },
  // ESM support in Jest
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
