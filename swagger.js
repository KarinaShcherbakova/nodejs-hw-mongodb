const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("yaml");

const app = express();
const swaggerFile = fs.readFileSync("./docs/openapi.yaml", "utf8");
const swaggerDocument = yaml.parse(swaggerFile);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3001, () => console.log("API Docs available at http://localhost:3001/api-docs"));
