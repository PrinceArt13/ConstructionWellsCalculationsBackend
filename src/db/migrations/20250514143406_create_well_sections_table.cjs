exports.up = function (knex) {
    return knex.schema.createTable('well_sections', (table) => {
      table.increments('id').primary();
      table.integer('well_id')
        .unsigned()
        .references('id')
        .inTable('wells')
        .onDelete('SET NULL')
        .onUpdate('CASCADE'); // Связь со скважиной
      table.integer('sectionNumber').notNullable(); // Номер секции
      table.integer('diameter').notNullable(); // Диаметр ствола, мм
      table.integer('length').notNullable(); // Длина секции, м
      table.string('material').notNullable(); // Материал обсадной колонны
      table.decimal('inclination', 5, 2).defaultTo(0.0); // Угол наклона
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('well_sections');
  };