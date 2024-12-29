import express from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import routes from "./routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Загрузка сгенерированной документации
const swaggerSpec = JSON.parse(readFileSync("./swagger.json", "utf-8"));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Подключение маршрутов
app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
