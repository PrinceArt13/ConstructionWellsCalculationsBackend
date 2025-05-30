import express from "express";
import * as swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import routes from "./routes";
import { queryParser } from "express-query-parser";
import cors from 'cors';

export const app = express();
const PORT = process.env.PORT || 3001;

// Загрузка сгенерированной документации
const swaggerSpec = JSON.parse(readFileSync("./swagger.json", "utf-8"));

app.use(cors());

app.use(express.json());

// Настройка express-query-parser
app.use(
    queryParser({
        parseNull: true,
        parseUndefined: true,
        parseBoolean: true,
        parseNumber: true,
    })
);


// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Подключение маршрутов
app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
