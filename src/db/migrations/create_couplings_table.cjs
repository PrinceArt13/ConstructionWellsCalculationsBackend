exports.up = function (knex) {
    return knex.schema.createTable('couplings', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique(); // Название муфты
      table.integer('outerDiameter').notNullable(); // Внешний диаметр, мм
      table.integer('innerDiameter').notNullable(); // Внутренний диаметр, мм
      table.integer('length').notNullable(); // Длина муфты, мм
      table.string('material'); // Материал изготовления
      table.timestamps(true, true); // created_at, updated_at
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('couplings');
  };