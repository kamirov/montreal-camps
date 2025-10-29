-- Sample camp data for Montreal Camps Directory
-- Note: name is the primary key

INSERT INTO camps (name, type, borough, age_range, languages, dates, hours, cost, financial_aid, link, phone, notes, latitude, longitude) VALUES
('Camp Plateau Aventure', 'day', 'Le Plateau-Mont-Royal', '5-12 ans', ARRAY['French', 'English'], 'June 24 - August 23, 2024', '8:00 AM - 5:00 PM', '$180/week', 'Available - Sliding scale based on income', 'https://example.com/plateau-aventure', '514-555-0101', 'Outdoor activities, swimming, arts and crafts. Snacks provided.', 45.52, -73.58),

('NDG Sports Camp', 'day', 'Côte-des-Neiges–Notre-Dame-de-Grâce', '6-14 years', ARRAY['English', 'French'], 'July 2 - August 16, 2024', '9:00 AM - 4:00 PM', '$150/week', 'Contact for information', 'https://example.com/ndg-sports', '514-555-0102', 'Soccer, basketball, track and field. Lunch not included.', 45.47, -73.61),

('Camp de Vacances Rosemont', 'vacation', 'Rosemont–La Petite-Patrie', '5-10 ans', ARRAY['French'], 'March 4-8, 2024 (Spring Break)', NULL, '$200/week', 'Available - Up to 50% reduction', 'https://example.com/rosemont-vacances', '514-555-0103', 'Thematic activities, games, creative workshops.', 45.54, -73.59),

('Camp Ahuntsic Nature', 'day', 'Ahuntsic-Cartierville', '4-12 ans', ARRAY['French'], 'July 1 - August 20, 2024', '7:30 AM - 5:30 PM', '$175/week', 'Available - Income-based subsidies', 'https://example.com/ahuntsic-nature', '514-555-0105', 'Nature exploration, hiking, environmental education.', 45.56, -73.67),

('Winter Camp Verdun', 'vacation', 'Verdun', '6-13 years', ARRAY['English', 'French'], 'December 23-30, 2024', NULL, '$300/week', 'Contact for information', 'https://example.com/verdun-winter', '514-555-0106', 'Indoor and outdoor winter activities, skating, crafts.', 45.45, -73.57),

('LaSalle Multi-Sports', 'day', 'LaSalle', '5-16 ans', ARRAY['French', 'English'], 'June 24 - August 23, 2024', '8:00 AM - 5:00 PM', '$160/week', 'Available - 30% reduction available', 'https://example.com/lasalle-sports', '514-555-0107', 'Various sports, swimming pool access, nutritious snacks.', 45.42, -73.63),

('Camp de Relâche Sud-Ouest', 'vacation', 'Le Sud-Ouest', '5-12 ans', ARRAY['French'], 'March 4-8, 2024', NULL, '$150/week', 'Available - Full subsidies for eligible families', 'https://example.com/so-relache', '514-555-0109', 'Games, sports, creative activities. Lunch included.', 45.47, -73.58),

('Camp Anjou Découverte', 'day', 'Anjou', '4-11 ans', ARRAY['French'], 'June 24 - August 23, 2024', '7:00 AM - 6:00 PM', '$170/week', 'Available - Contact for details', 'https://example.com/anjou-decouverte', '514-555-0110', 'Science, arts, sports, field trips.', 45.61, -73.55),

('Pierrefonds Holiday Camp', 'vacation', 'Pierrefonds-Roxboro', '5-13 years', ARRAY['English', 'French'], 'December 23-January 3, 2025', NULL, '$250/week', 'Available - Scholarships available', 'https://example.com/pierrefonds-holiday', '514-555-0112', 'Holiday crafts, winter sports, special events.', 45.49, -73.85),

('Camp Villeray Créatif', 'day', 'Villeray–Saint-Michel–Parc-Extension', '5-12 ans', ARRAY['French', 'English', 'Arabic'], 'June 24 - August 23, 2024', '8:00 AM - 5:00 PM', '$140/week', 'Available - Sliding scale payment', 'https://example.com/villeray-creatif', '514-555-0113', 'Arts, multicultural activities, sports, cooking.', 45.55, -73.62),

('Outremont Music & Arts', 'day', 'Outremont', '7-16 years', ARRAY['French', 'English'], 'July 8 - August 16, 2024', '9:00 AM - 4:00 PM', '$280/week', 'Contact for information', 'https://example.com/outremont-music', '514-555-0114', 'Music lessons, art classes, performances.', 45.52, -73.61),

('Rivière-des-Prairies Spring Camp', 'vacation', 'Rivière-des-Prairies–Pointe-aux-Trembles', '6-13 ans', ARRAY['French'], 'March 4-8, 2024', NULL, '$180/week', 'Available - Up to 40% reduction', 'https://example.com/rdp-spring', '514-555-0115', 'Outdoor activities, nature walks, games.', 45.65, -73.5),

('Saint-Léonard Cultural Camp', 'day', 'Saint-Léonard', '5-14 ans', ARRAY['French', 'English', 'Italian'], 'July 1 - August 20, 2024', '8:00 AM - 5:00 PM', '$165/week', 'Available - Income-based', 'https://example.com/sl-cultural', '514-555-0116', 'Cultural activities, language learning, sports.', 45.59, -73.59),

('CDN Winter Wonderland', 'vacation', 'Côte-des-Neiges–Notre-Dame-de-Grâce', '4-10 years', ARRAY['English', 'French'], 'December 23-30, 2024', NULL, '$220/week', 'Available - Limited spots', 'https://example.com/cdn-winter', '514-555-0118', 'Winter activities, crafts, indoor games, hot chocolate.', 45.475, -73.615),

('Camp Verdun Actif', 'day', 'Verdun', '5-13 ans', ARRAY['French', 'English'], 'June 24 - August 23, 2024', '7:30 AM - 5:30 PM', '$155/week', 'Available - Partial subsidies', 'https://example.com/verdun-actif', '514-555-0119', 'Active games, swimming, team sports.', 45.455, -73.565),

('Ville-Marie Leadership Camp', 'day', 'Ville-Marie', '12-17 years', ARRAY['English', 'French'], 'July 8 - August 9, 2024', '9:00 AM - 5:00 PM', '$275/week', 'Scholarships available', 'https://example.com/vm-leadership', '514-555-0120', 'Leadership development, community service, workshops.', 45.505, -73.565),

('Camp de Relâche LaSalle', 'vacation', 'LaSalle', '6-12 ans', ARRAY['French'], 'March 4-8, 2024', NULL, '$160/week', 'Available - Contact for details', 'https://example.com/lasalle-relache', '514-555-0121', 'Indoor activities, crafts, movies, snacks included.', 45.425, -73.625),

('Rosemont Adventure Camp', 'day', 'Rosemont–La Petite-Patrie', '6-14 years', ARRAY['French', 'English'], 'June 24 - August 23, 2024', '8:00 AM - 5:00 PM', '$190/week', 'Available - Income-based assistance', 'https://example.com/rosemont-adventure', '514-555-0122', 'Rock climbing, zip-lining, outdoor challenges.', 45.545, -73.585),

('Sud-Ouest Multi-Arts', 'day', 'Le Sud-Ouest', '5-15 ans', ARRAY['French', 'English'], 'July 1 - August 20, 2024', '8:30 AM - 4:30 PM', '$170/week', 'Available - Full and partial subsidies', 'https://example.com/so-arts', '514-555-0123', 'Visual arts, music, dance, theater.', 45.465, -73.585),

('Saint-Laurent Bilingual Camp', 'day', 'Saint-Laurent', '4-12 years', ARRAY['English', 'French'], 'June 24 - August 23, 2024', '7:00 AM - 6:00 PM', '$185/week', 'Available - Sliding scale', 'https://example.com/sl-bilingual', '514-555-0125', 'Language immersion, cultural activities, games.', 45.515, -73.665);

