const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Recipe Manager API",
    description: "REST API for managing recipes and ingredients",
    version: "1.0.0",
  },
  host: "cse341-project2-l8lq.onrender.com",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
