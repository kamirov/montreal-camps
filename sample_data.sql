-- Sample camp data for Montreal Camps
-- Schema: name, borough, age_range (jsonb), languages (array), dates (jsonb), financial_aid, link, phone, phone_extension, notes
-- Note: After migration 0003, the type column is removed. All camps are day camps.

INSERT INTO camps (name, borough, age_range, languages, dates, financial_aid, link, phone, phone_extension, notes) VALUES
-- Day Camps
(
  'Camp Plateau Aventure',
  'Le Plateau-Mont-Royal',
  '{"type": "range", "allAges": false, "from": 5, "to": 12}'::jsonb,
  ARRAY['French', 'English'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-06-24", "toDate": "2024-08-23"}'::jsonb,
  'Available - Sliding scale based on income',
  'https://example.com/plateau-aventure',
  '5145550101',
  NULL,
  'Outdoor activities, swimming, arts and crafts. Snacks provided.'
),
(
  'NDG Sports Camp',
  'Côte-des-Neiges–Notre-Dame-de-Grâce',
  '{"type": "range", "allAges": false, "from": 6, "to": 14}'::jsonb,
  ARRAY['English', 'French'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-07-02", "toDate": "2024-08-16"}'::jsonb,
  'Contact for information',
  'https://example.com/ndg-sports',
  '5145550102',
  NULL,
  'Soccer, basketball, track and field. Lunch not included.'
),
(
  'Rosemont Creative Arts',
  'Rosemont–La Petite-Patrie',
  '{"type": "all", "allAges": true}'::jsonb,
  ARRAY['French'],
  '{"type": "yearRound", "yearRound": true}'::jsonb,
  'Subsidized rates available',
  'https://example.com/rosemont-arts',
  '5145550103',
  '123',
  'Painting, sculpture, music. All skill levels welcome.'
),
(
  'Verdun Nature Camp',
  'Le Sud-Ouest',
  '{"type": "range", "allAges": false, "from": 7, "to": 15}'::jsonb,
  ARRAY['French', 'English'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-07-08", "toDate": "2024-08-09"}'::jsonb,
  'Financial assistance available',
  'https://example.com/verdun-nature',
  '5145550104',
  NULL,
  'Ecology, hiking, camping skills. Equipment provided.'
),
(
  'Outremont Science Lab',
  'Outremont',
  '{"type": "range", "allAges": false, "from": 8, "to": 13}'::jsonb,
  ARRAY['French', 'English'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-07-15", "toDate": "2024-08-23"}'::jsonb,
  'Scholarships available for qualifying families',
  'https://example.com/outremont-science',
  '5145550105',
  NULL,
  'STEM activities, experiments, robotics. Advanced program.'
),
-- Day Camps (converted from vacation camps)
(
  'Lachine Winter Break Camp',
  'Lachine',
  '{"type": "range", "allAges": false, "from": 5, "to": 12}'::jsonb,
  ARRAY['French', 'English'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-12-23", "toDate": "2025-01-03"}'::jsonb,
  'Discounted rates for early registration',
  'https://example.com/lachine-winter',
  '5145550201',
  NULL,
  'Winter activities, indoor games, crafts. Full day program during school break.'
),
(
  'Ahuntsic Spring Camp',
  'Ahuntsic-Cartierville',
  '{"type": "range", "allAges": false, "from": 6, "to": 14}'::jsonb,
  ARRAY['French'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-03-04", "toDate": "2024-03-15"}'::jsonb,
  'Subsidy programs accepted',
  'https://example.com/ahuntsic-spring',
  '5145550202',
  NULL,
  'Spring break activities. Swimming, sports, arts. Extended hours available.'
),
(
  'LaSalle Music Camp',
  'LaSalle',
  '{"type": "all", "allAges": true}'::jsonb,
  ARRAY['English', 'French', 'Spanish'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-07-01", "toDate": "2024-07-12"}'::jsonb,
  'Need-based financial aid available',
  'https://example.com/lasalle-music',
  '5145550203',
  '456',
  'Music lessons, ensemble playing, recording studio. Instruments provided.'
),
(
  'Ville-Marie Tech Camp',
  'Ville-Marie',
  '{"type": "range", "allAges": false, "from": 10, "to": 16}'::jsonb,
  ARRAY['French', 'English'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-08-12", "toDate": "2024-08-23"}'::jsonb,
  'Contact for scholarship information',
  'https://example.com/ville-marie-tech',
  '5145550204',
  NULL,
  'Coding, web development, game design. Laptops provided.'
),
(
  'Pierrefonds Adventure Camp',
  'Pierrefonds-Roxboro',
  '{"type": "range", "allAges": false, "from": 8, "to": 15}'::jsonb,
  ARRAY['English', 'French'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-12-27", "toDate": "2025-01-05"}'::jsonb,
  'Early bird discount: 10% off before December 1st',
  'https://example.com/pierrefonds-adventure',
  '5145550205',
  NULL,
  'Multi-sport activities, team building, outdoor excursions. Overnight option available.'
),
-- More Day Camps
(
  'Montreal North Dance Studio',
  'Montréal-Nord',
  '{"type": "range", "allAges": false, "from": 4, "to": 18}'::jsonb,
  ARRAY['French', 'English', 'Arabic'],
  '{"type": "yearRound", "yearRound": true}'::jsonb,
  'Community subsidy program',
  'https://example.com/montreal-north-dance',
  '5145550106',
  NULL,
  'Hip-hop, ballet, contemporary. Performance opportunities.'
),
(
  'Saint-Laurent Language Immersion',
  'Saint-Laurent',
  '{"type": "range", "allAges": false, "from": 5, "to": 10}'::jsonb,
  ARRAY['English', 'French'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-06-17", "toDate": "2024-08-30"}'::jsonb,
  'Multi-child discounts available',
  'https://example.com/saint-laurent-immersion',
  '5145550107',
  NULL,
  'Bilingual activities, language learning through play. Native speakers.'
),
(
  'Westmount Chess Academy',
  'Westmount',
  '{"type": "range", "allAges": false, "from": 7, "to": 16}'::jsonb,
  ARRAY['English', 'French'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-07-08", "toDate": "2024-08-16"}'::jsonb,
  'Free for qualifying low-income families',
  'https://example.com/westmount-chess',
  '5145550108',
  NULL,
  'Chess instruction, tournaments, strategy games. All levels welcome.'
),
(
  'Côte-Saint-Luc Tennis Camp',
  'Côte-Saint-Luc',
  '{"type": "range", "allAges": false, "from": 6, "to": 17}'::jsonb,
  ARRAY['English', 'French'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-06-24", "toDate": "2024-08-30"}'::jsonb,
  'Equipment rental available',
  'https://example.com/cote-saint-luc-tennis',
  '5145550109',
  NULL,
  'Professional coaching, courts included. Half-day or full-day options.'
),
(
  'Mercier-Hochelaga Cooking Camp',
  'Mercier–Hochelaga-Maisonneuve',
  '{"type": "range", "allAges": false, "from": 8, "to": 14}'::jsonb,
  ARRAY['French'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-07-15", "toDate": "2024-08-16"}'::jsonb,
  'Sliding scale: $100-$160 based on income',
  'https://example.com/mercier-cooking',
  '5145550110',
  NULL,
  'Learn to cook, bake, meal prep. Ingredients included. Take home meals.'
),
-- More Day Camps
(
  'Beaconsfield Winter Sports',
  'Beaconsfield',
  '{"type": "range", "allAges": false, "from": 9, "to": 16}'::jsonb,
  ARRAY['English', 'French'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-12-23", "toDate": "2025-01-05"}'::jsonb,
  'Multi-week discounts available',
  'https://example.com/beaconsfield-winter',
  '5145550206',
  NULL,
  'Skiing, snowboarding, ice skating. Equipment rental included. Daily field trips.'
),
(
  'Dollard-des-Ormeaux Theatre Camp',
  'Dollard-des-Ormeaux',
  '{"type": "range", "allAges": false, "from": 7, "to": 15}'::jsonb,
  ARRAY['English', 'French'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-07-22", "toDate": "2024-08-02"}'::jsonb,
  'Scholarship program for talented students',
  'https://example.com/ddo-theatre',
  '5145550207',
  NULL,
  'Acting, singing, stagecraft. End-of-camp performance for families.'
),
(
  'Rivière-des-Prairies Nature',
  'Rivière-des-Prairies–Pointe-aux-Trembles',
  '{"type": "range", "allAges": false, "from": 6, "to": 12}'::jsonb,
  ARRAY['French', 'English'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-08-05", "toDate": "2024-08-16"}'::jsonb,
  'Early registration: $50 off before June 1st',
  'https://example.com/riviere-nature',
  '5145550208',
  NULL,
  'Bird watching, plant identification, nature crafts. Mostly outdoor activities.'
),
(
  'Saint-Léonard Soccer Intensive',
  'Saint-Léonard',
  '{"type": "range", "allAges": false, "from": 10, "to": 17}'::jsonb,
  ARRAY['French', 'English', 'Italian'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-07-08", "toDate": "2024-07-19"}'::jsonb,
  'Team discounts available',
  'https://example.com/saint-leonard-soccer',
  '5145550209',
  NULL,
  'Intensive training with professional coaches. Scrimmages and tournaments included.'
),
(
  'Anjou Swimming Camp',
  'Anjou',
  '{"type": "range", "allAges": false, "from": 5, "to": 13}'::jsonb,
  ARRAY['French', 'English'],
  '{"type": "range", "yearRound": false, "fromDate": "2024-08-12", "toDate": "2024-08-23"}'::jsonb,
  'Sibling discount: 15% off second child',
  'https://example.com/anjou-swimming',
  '5145550210',
  NULL,
  'Swimming lessons, water games, pool safety. Certified instructors. Indoor pool facility.'
);
