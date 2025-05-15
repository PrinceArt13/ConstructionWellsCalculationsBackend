
exports.up = function(knex) {
    return knex.schema.createTable('frontend', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable().unique(); // Название метода
        table.string('information').notNullable(); // информация о расчёте
        table.string('latex',10000).notNullable(); // latex строка для фронтенда
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('wells');
};
