import swaggerAutogen from "swagger-autogen";

const options = {
  info: {
    title: "Panda-market-api",
    version: "1.0.0",
    description: "API 문서입니다.",
  },
  host: "https://nine-sprint-mission-be.onrender.com/",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, options);
