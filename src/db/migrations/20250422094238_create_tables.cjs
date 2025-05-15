exports.up = function (knex) {
    return knex.schema.createTable('constants', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable(); // название константы
      table.decimal('value', 10, 4).notNullable(); // значение
      table.text('unit').notNullable(); // единица измерения
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('constants');
  };