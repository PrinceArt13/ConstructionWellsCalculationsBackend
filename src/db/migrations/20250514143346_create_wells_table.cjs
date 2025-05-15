exports.up = function (knex) {
    return knex.schema.createTable('wells', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique(); // Название скважины
      table.string('location').notNullable(); // Локация скважины
      table.integer('depth').notNullable(); // Глубина скважины, м
      table.string('type').notNullable(); // Тип скважины (нефтяная, газовая и т.п.)
      table.integer('operator_id').nullable(); // ID оператора или подрядчика
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('wells');
  };