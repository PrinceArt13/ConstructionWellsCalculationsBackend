import { Kysely, PostgresDialect } from 'kysely';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv'

dotenv.config();

const pool = new Pool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Создание экземпляра Kysely
export const db = new Kysely<any>({
    dialect: new PostgresDialect({ pool: pool }),
});

// Закрытие соединения
export async function closeDatabaseConnection() {
    await db.destroy();
}