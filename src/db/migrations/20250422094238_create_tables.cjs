exports.up = function (knex) {
    return knex.schema.createTable('constants', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.decimal('value', 10, 4).notNullable();
      table.text('unit').notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('constants');
  };