const wells = [
    { name: 'Well-001', location: 'Тюменская область, куст №12', depth: 2000, type: 'Нефтяная', operator_id: 1 },
    { name: 'Well-002', location: 'Ямало-Ненецкий АО, куст №3', depth: 2500, type: 'Газовая', operator_id: null },
    { name: 'Well-003', location: 'Ханты-Мансийский район, куст №45', depth: 1800, type: 'Разведочная', operator_id: 2 },
  ];
  
  exports.seed = async function (knex) {
    await knex('wells').del();
    await knex('wells').insert(wells);
  };