import Knex from 'knex';
import * as path from 'path'

const knexConfig = require(path.join(__dirname, 'knexfile.cjs'))[process.env.NODE_ENV || 'development'];

const knex = Knex(knexConfig);

// Функция для закрытия соединения
export async function closeDatabaseConnection() {
  await knex.destroy();
}

export default knex