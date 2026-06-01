const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Recipe Manager API",
    description: "REST API for managing recipes and ingredients",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
