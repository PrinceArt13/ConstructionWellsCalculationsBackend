const wellSections = [
    { well_id: 1, sectionNumber: 1, diameter: 190, length: 1000, material: 'Стальная обсадная труба', inclination: 0.0 },
    { well_id: 1, sectionNumber: 2, diameter: 146, length: 500, material: 'Обсадная труба', inclination: 3.5 },
    { well_id: 2, sectionNumber: 1, diameter: 245, length: 1200, material: 'Стальная обсадная труба', inclination: 0.0 },
    { well_id: 2, sectionNumber: 2, diameter: 190, length: 1300, material: 'Трубы с покрытием', inclination: 2.8 },
    { well_id: 3, sectionNumber: 1, diameter: 311, length: 1000, material: 'Стальные трубы', inclination: 0.0 },
  ];
  
  exports.seed = async function (knex) {
    await knex('well_sections').del();
    await knex('well_sections').insert(wellSections);
  };