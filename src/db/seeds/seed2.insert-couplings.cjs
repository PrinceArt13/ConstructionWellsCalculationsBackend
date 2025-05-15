const couplings = [
    { name: 'Coupling-A1', outerDiameter: 73, innerDiameter: 60, length: 150, material: 'Сталь 30ХГСА' },
    { name: 'Coupling-B1', outerDiameter: 89, innerDiameter: 75, length: 150, material: 'Сталь 30ХГСА' },
    { name: 'Coupling-C1', outerDiameter: 146, innerDiameter: 120, length: 200, material: 'Сталь 30ХГСА' },
  ];
  
  exports.seed = async function (knex) {
    await knex('couplings').del(); // Очистка перед вставкой
    await knex('couplings').insert(couplings);
  };