exports.seed = function (knex) {
    return knex('constants').insert([
      { name: 'ro', value: 1.3, unit: 'кг/м^3' },
      { name: 'g', value: 0.00981, unit: 'м/с^2' },
    ]);
  };